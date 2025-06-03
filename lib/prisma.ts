import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
//When you're in a development environment (like with Next.js or Vite), the app reloads often — which can cause multiple Prisma Clients to be created and throw errors like:

//Error: There are already 10 Prisma Clients actively running
