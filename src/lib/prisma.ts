import { PrismaClient } from '@prisma/client'

/**
 * Singleton Prisma Client pour éviter les connexions multiples
 * Configuration optimisée pour la production
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'], // Logs d'erreur uniquement en production
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// ✅ FIX : Réutiliser l'instance en développement pour éviter les connexions multiples
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ FIX : Gérer la fermeture propre des connexions
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

