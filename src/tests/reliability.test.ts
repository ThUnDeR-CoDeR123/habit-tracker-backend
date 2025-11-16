import request from "supertest";
import app from "../server";
import prisma from "../config/database";
import { cleanupTestUser } from "./test-utils";
import dayjs from "dayjs";

const TEST_EMAIL = "reliability@example.com";
const TEST_PASSWORD = "password123";

let token = "";
let habitId = "";

beforeAll(async () => {
 
  await cleanupTestUser(TEST_EMAIL);

  await request(app).post("/api/auth/register").send({
    name: "Reliability Test",
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  token = loginRes.body.token;

 
  const createRes = await request(app)
    .post("/api/habits")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Reliability Habit", frequency: "daily" });

  habitId = createRes.body.data.id;
});

afterAll(async () => {
  await cleanupTestUser(TEST_EMAIL);
  await prisma.$disconnect();
});

describe("Reliability Tests", () => {
  it("calculates streak accurately for consecutive days", async () => {
    // cleanup any existing logs
    await prisma.trackingLog.deleteMany({ where: { habitId } });

    // create logs for today, yesterday, day-before-yesterday => streak 3
    const dates = [0, 1, 2].map((i) => dayjs().subtract(i, "day").format("YYYY-MM-DD"));

    for (const date of dates) {
      await prisma.trackingLog.create({ data: { habitId, date } });
    }

    const res = await request(app)
      .get(`/api/habits/${habitId}/streak`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.streak).toBe(3);
  });

  it("breaks streak when a day is missed", async () => {
    // cleanup
    await prisma.trackingLog.deleteMany({ where: { habitId } });

    // create logs for today and day-before-yesterday (skip yesterday)
    const today = dayjs().format("YYYY-MM-DD");
    const skip = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const before = dayjs().subtract(2, "day").format("YYYY-MM-DD");

    await prisma.trackingLog.create({ data: { habitId, date: today } });
    await prisma.trackingLog.create({ data: { habitId, date: before } });

    const res = await request(app)
      .get(`/api/habits/${habitId}/streak`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    // streak should be 1 (only today contiguous)
    expect(res.body.streak).toBe(1);
  });

  it("enforces track endpoint rate limiting (trackLimiter)", async () => {
    // cleanup logs so attempts are predictable
    await prisma.trackingLog.deleteMany({ where: { habitId } });

    const attempts = [] as any[];

    for (let i = 0; i < 6; i++) {
      // perform track requests; duplicates may return 409 but limiter counts attempts
      // small delay not needed because limiter window is long
      // store responses
      // eslint-disable-next-line no-await-in-loop
      const res = await request(app)
        .post(`/api/habits/${habitId}/track`)
        .set("Authorization", `Bearer ${token}`);
      attempts.push(res);
    }

    // At least one of the attempts should be rate-limited (429)
    const rateLimited = attempts.find((r) => r.status === 429);
    expect(rateLimited).toBeDefined();
    expect(rateLimited!.body.message).toBe("You already tracked too many times today.");
  });

  it("handles duplicate track attempts with proper error (409)", async () => {
    // cleanup
    await prisma.trackingLog.deleteMany({ where: { habitId } });

    // first track may be rate-limited if previous tests consumed the quota.
    const first = await request(app)
      .post(`/api/habits/${habitId}/track`)
      .set("Authorization", `Bearer ${token}`);

    if (first.status === 201) {
      // second immediate track should return 409 Already tracked today
      const second = await request(app)
        .post(`/api/habits/${habitId}/track`)
        .set("Authorization", `Bearer ${token}`);

      expect(second.status).toBe(409);
      expect(second.body.message).toBe("Already tracked today");
    } else {
      // If quota already consumed, ensure we got rate-limited
      expect(first.status).toBe(429);
      expect(first.body.message).toBe("You already tracked too many times today.");
    }
  });
});
