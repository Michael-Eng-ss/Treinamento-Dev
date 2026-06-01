import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";


export default async function migrations(request, response) {
  const allowMethods = ["POST", "GET"];
  if (!allowMethods.includes(request.method)) {
    return response.status(405).end({error:`Method ${request.method} not allowed`});
  }

  let dbClient;
  
  try{
   dbClient = await database.getNewClient();
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
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    } 
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);
    return response.status(200).json(pendingMigrations);
  }
}catch(error){
  console.error(error);
  return response.status(500).json({error:error.message});
} finally {
  if (dbClient) {
    await dbClient.end();
  }
} 
}
