import "dotenv/config";
import Redis from "ioredis";
import * as schema from "./drizle/schema";
import { getEnvVariable } from "../../utils/configs/variable";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
	url: "file:./" + getEnvVariable("DB_LITE"),
});

export const db = drizzle(client, { schema });
