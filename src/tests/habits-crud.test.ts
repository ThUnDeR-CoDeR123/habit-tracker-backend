import request from "supertest";
import app from "../server";
import { cleanupTestUser } from "./test-utils";
import prisma from "../config/database";

let token = "";
let habitId = "";

beforeAll(async () => {
  // Only cleanup if user doesn't exist - reuse from auth tests
  const existingUser = await prisma.user.findUnique({
    where: { email: "test@example.com" }
  });

  if (!existingUser) {
    // Register user if it doesn't exist (in case habits tests run first)
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });
  }

  // Login to get token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password123"
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  // Clean up user and disconnect only at the very end
  await cleanupTestUser("test@example.com");
  await prisma.$disconnect();
});
describe("Habit CRUD + Tracking Tests", () => {

  // Create Habit
  it("should create a habit", async () => {
    const res = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Habit",
        description: "Testing habit creation",
        frequency: "daily"
      });

    expect(res.statusCode).toBe(201);
    habitId = res.body.data.id;
  });

  // Get All Habits
  it("should return all habits for logged in user", async () => {
    const res = await request(app)
      .get("/api/habits")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Get Habit by ID
  it("should return habit details", async () => {
    const res = await request(app)
      .get(`/api/habits/${habitId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(habitId);
  });

  // Track Habit Once Today
  it("should track completion for today", async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/track`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // Duplicate track should fail
  it("should prevent duplicate tracking today", async () => {
    const res = await request(app)
      .post(`/api/habits/${habitId}/track`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Already tracked today");
  });

  // History Test
  it("should return last 7 days history", async () => {
    const res = await request(app)
      .get(`/api/habits/${habitId}/history`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Streak Test
  it("should return streak count", async () => {
    const res = await request(app)
      .get(`/api/habits/${habitId}/streak`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.streak).toBeGreaterThanOrEqual(1);
  });

  // Update Habit
  it("should update a habit", async () => {
    const res = await request(app)
      .put(`/api/habits/${habitId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Habit" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Updated successfully");
  });

  // Delete Habit
  it("should delete a habit", async () => {
    const res = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Habit deleted");
  });

});
