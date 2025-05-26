// db.ts
import { MongoClient, Db, ServerApiVersion } from "mongodb";



export const dbClient = async (): Promise<MongoClient> => {


  const client = new MongoClient(process.env.MONGO_DB_URL!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });


  return  client
};

