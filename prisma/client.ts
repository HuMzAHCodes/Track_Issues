import { PrismaClient } from '@prisma/client'

// Function that creates a new PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// TypeScript type for the return value of the above function
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Cast globalThis to include an optional prisma property
// This lets us store the client on the global object
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Use the existing global instance if it exists, otherwise create a new one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

// In development, Next.js reloads modules on every change (hot reload)
// Without this, each reload would create a NEW PrismaClient connection
// which would eventually exhaust your database connection limit.
// So we save the instance to globalThis in development to reuse it.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma



// What this code does in simple terms:
// It creates a single shared PrismaClient instance for your whole app. Without this, 
// in Next.js development mode, every time you save a file it would create a brand new database 
// connection — eventually you'd hit the database connection limit and crash. By saving it to 
// globalThis, the same connection is reused across hot reloads.


// In production this isn't a problem (no hot reloading), 
// so the check at the bottom only runs in development.