// db.ts
import { MongoClient, Db, ServerApiVersion } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export const requireDb = async (): Promise<Db> => {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_DB_URL!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  db = client.db(); // default database from URI or set a specific one: client.db("mydb")
  return db;
};

// Optional: clean up when needed
export const disconnectDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
