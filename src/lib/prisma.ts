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
  })

// En production, on ne réutilise pas l'instance entre les rechargements
// pour éviter les problèmes de connexion

