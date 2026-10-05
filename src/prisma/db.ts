import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract';
import contractJson from './contract.json' with { type: 'json' };
import { MongoClient } from "mongodb"

const client = new MongoClient(Bun.env.DATABASE_URL)
export const db = mongo<Contract>({
  contractJson,
  mongoClient: client,
  dbName: "webhook"
});

