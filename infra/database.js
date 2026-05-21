import { Client } from 'pg'

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}
async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: await getSSLValues(),
  });
  await client.connect();
  return client;
}

async function getSSLValues() {
  if (process.env.POSTGRES_HOST === "localhost") {
    return false;
  }

  return true;
}

export default {
  query,
  getNewClient,
  getSSLValues,
};
