// api/src/prisma.js
import { PrismaClient } from "@prisma/client";

let prisma = global._prisma;
if (!prisma) {
  prisma = new PrismaClient();
  global._prisma = prisma; // cache for hot-reload/serverless
}

export default prisma;
