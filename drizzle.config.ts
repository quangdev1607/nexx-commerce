import "dotenv/config";

import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
