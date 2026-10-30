import request from "supertest"; 
import { app } from "../../app.js"; 
import { prisma } from "../../db/client.js"; 
import { resetDatabase } from "../../test-utils/fixtures.js"; 

beforeEach(async () => { 
  await resetDatabase(); 
}); 

afterAll(async () => { 
  await prisma.$disconnect(); 
}); 

test("full flow: register, publish, and browse (US-01, US-03, US-04 validation)", async () => { 
  const registerRes = await request(app) 
    .post("/api/auth/register") 
    .send({ email: "alice@example.com", displayName: "Alice", password: "correcthorse" }); 
  expect(registerRes.status).toBe(201); 
  const { user, accessToken } = registerRes.body; 

  const publishRes = await request(app) 
    .post("/api/posts") 
    .set("Authorization", `Bearer ${accessToken}`) 
    .send({ authorId: user.id, title: "Hello, Inkwell", body: "My first real post." }); 
  expect(publishRes.status).toBe(201); 

  const feedRes = await request(app).get("/api/posts?page=1"); 
  expect(feedRes.status).toBe(200); 
  expect(feedRes.body.posts).toHaveLength(1); 
  expect(feedRes.body.posts[0].title).toBe("Hello, Inkwell"); 
});