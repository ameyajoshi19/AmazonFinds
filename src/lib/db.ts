import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local\n" +
        "  Get it from: https://console.neon.tech → your project → Connection string"
    );
  }
  return drizzle(neon(url), { schema });
}

export const db = createDb();
