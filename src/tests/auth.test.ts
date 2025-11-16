import request from "supertest";
import app from "../server";
import { cleanupTestUser } from "./test-utils";
import prisma from "../config/database";

let token = "";

beforeAll(async () => {
  // Ensure user doesn't exist for clean test
  await cleanupTestUser("test@example.com");
});

afterAll(async () => {
  // Disconnect Prisma but don't delete user - let next suite use it
  await prisma.$disconnect();
});
describe("Authentication Tests", () => {

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should login and receive token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

});
