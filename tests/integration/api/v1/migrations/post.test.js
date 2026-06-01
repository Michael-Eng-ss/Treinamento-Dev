import database from "infra/database.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

beforeAll(async () => {
  await cleanDatabase();
});

test("POST /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response1.status).toBe(201);
  const reaponse1Body = await response1.json();
  expect(Array.isArray(reaponse1Body)).toBe(true);
  expect(reaponse1Body.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response2.status).toBe(200);
  const reaponse2Body = await response2.json();
  expect(Array.isArray(reaponse2Body)).toBe(true);
  expect(reaponse2Body.length).toBe(0);
});
