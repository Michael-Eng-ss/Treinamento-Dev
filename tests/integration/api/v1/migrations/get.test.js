import database from "infra/database.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;  ");
}

beforeAll(async () => {
  await cleanDatabase();
});



test("GET /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  expect(response.status).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
