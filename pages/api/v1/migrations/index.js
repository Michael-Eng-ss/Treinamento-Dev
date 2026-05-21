import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";


export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const migrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join(process.cwd(), "infra/migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true, 
};
  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    } 
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }
  response.status(405).end(); 
}
