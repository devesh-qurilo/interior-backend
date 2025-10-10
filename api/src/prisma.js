import { PrismaClient } from "@prisma/client";
let prisma = global._prisma || new PrismaClient();
if (!global._prisma) global._prisma = prisma;
export default prisma;
