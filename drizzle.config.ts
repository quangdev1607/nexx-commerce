// import "dotenv/config";

import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({
    path: ".env.local",
});

export default {
    schema: "./server/db/schema.ts",
    out: "./server/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
} satisfies Config;
