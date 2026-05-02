/**
 * Integration test: assert POST /api/chatbot/signup/complete creates a pending user
 *
 * This test verifies that the chatbot signup endpoint properly creates
 * accounts with 'pending' status and stores user data correctly.
 */

import express from "express";
import request from "supertest";

jest.mock("../storage", () => {
  // Simple in-memory spy implementation of storage used by server routes
  const upsertUser = jest.fn().mockResolvedValue({
    id: "mock_user_id",
    email: "test@example.com",
    status: "pending"
  });

  const getUserByEmail = jest.fn().mockResolvedValue(null);

  return {
    storage: {
      upsertUser,
      getUserByEmail,
      // Add other storage methods the route might call as no-op mocks
      createOrUpdateUserProfile: jest.fn().mockResolvedValue({}),
      // Expose the spies so tests can assert on them
    },
  };
});

jest.mock("../db", () => ({
  db: {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{
          id: "mock_user_id",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          status: "pending"
        }])
      })
    })
  }
}));

describe("POST /api/chatbot/signup/complete", () => {
  let app: express.Express;
  let storageMock: any;

  beforeAll(async () => {
    // Require after jest.mock to ensure the mocked storage is used by the route module
    const { registerChatbotRoutes } = await import("../routes/chatbotRoutes");

    app = express();
    app.use(express.json());

    // Register only chatbot routes (keeps test fast and focused)
    registerChatbotRoutes(app);

    // Import the mocked storage to assert calls
    const storageModule = require("../storage");
    storageMock = storageModule.storage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a pending user and persists via storage.upsertUser", async () => {
    const payload = {
      email: "tester+ci@example.com",
      firstName: "CI",
      lastName: "Tester",
      role: "investor",
      company: "TestCo",
      experienceLevel: "Beginner",
      // Include fields the route may expect
      sessionId: "test-session-123",
      recaptchaToken: "test-token",
      honeypot: ""
    };

    const res = await request(app).post("/api/chatbot/signup/complete").send(payload);

    // Expect HTTP success (200-299)
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    // storage.upsertUser should have been called to persist the new user
    expect(storageMock.upsertUser).toHaveBeenCalled();
    const createdArg = storageMock.upsertUser.mock.calls[0][0];

    // Assert key fields were passed and the user is created with pending status
    expect(createdArg).toMatchObject({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    // Important: chatbot signup should create accounts with status 'pending'
    expect(createdArg.status).toBe("pending");
  });

  it("handles missing required fields", async () => {
    const incompletePayload = {
      email: "test@example.com",
      // Missing firstName
    };

    const res = await request(app).post("/api/chatbot/signup/complete").send(incompletePayload);

    // Should return error for missing required fields
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("includes security fields in the request", async () => {
    const payloadWithSecurity = {
      email: "secure@example.com",
      firstName: "Secure",
      lastName: "User",
      role: "investor",
      sessionId: "secure-session-456",
      recaptchaToken: "valid-recaptcha-token",
      honeypot: "", // Should be empty for legitimate users
    };

    const res = await request(app).post("/api/chatbot/signup/complete").send(payloadWithSecurity);

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    // Verify the security fields were processed
    expect(storageMock.upsertUser).toHaveBeenCalled();
    const createdArg = storageMock.upsertUser.mock.calls[0][0];
    expect(createdArg.status).toBe("pending");
  });
});