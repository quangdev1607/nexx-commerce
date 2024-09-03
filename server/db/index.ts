import "dotenv/config";

import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/server/db/schema";
import postgres from "postgres";

const drizzleClient = drizzle(
    postgres(process.env.DATABASE_URL!, {
        prepare: false,
    }),
    { schema }
);

declare global {
    var database: PostgresJsDatabase<typeof schema> | undefined;
}

export const db = global.database || drizzleClient;
if (process.env.NODE_ENV !== "production") global.database = db;
