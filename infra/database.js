import { Client } from 'pg'

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
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
  if (process.env.POSTGRES_HOST === "production") {
    return true;
  }

  return false;
}

export default {
  query,
  getNewClient,
  getSSLValues,
};
