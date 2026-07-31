import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;