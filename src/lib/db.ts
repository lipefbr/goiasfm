import { PrismaClient } from '@prisma/client'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  __dbInitialized: boolean | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })
}

/**
 * Cria as tabelas do schema usando SQL direto via Prisma $executeRaw.
 * Usa CREATE TABLE IF NOT EXISTS — não destrói tabelas existentes.
 */
const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

  CREATE TABLE IF NOT EXISTS "News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSecondary" BOOLEAN NOT NULL DEFAULT false,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "hoursAgo" INTEGER NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug");

  CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "youtubeId" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
  );
`

/**
 * Garante que o banco SQLite existe e tem as tabelas criadas.
 * Usa apenas o Prisma (sem better-sqlite3 nativo) para máxima compatibilidade.
 */
async function ensureDatabase() {
  if (globalForPrisma.__dbInitialized) return

  try {
    const dbUrl = process.env.DATABASE_URL || ''

    // 1. Para SQLite: garante que o diretório do banco existe
    if (dbUrl.startsWith('file:')) {
      let dbPath = dbUrl.replace(/^file:/, '')
      if (dbPath.startsWith('./')) dbPath = dbPath.substring(2)
      if (!path.isAbsolute(dbPath)) {
        dbPath = path.join(process.cwd(), dbPath)
      }
      const dbDir = path.dirname(dbPath)
      if (!existsSync(dbDir)) {
        try {
          mkdirSync(dbDir, { recursive: true })
        } catch (e) {
          console.error('[db] Erro ao criar diretório:', e)
        }
      }
    }

    // 2. Cria um PrismaClient temporário para inicializar o banco
    const tempClient = new PrismaClient({
      log: ['error'],
    })

    try {
      // 3. Executa as CREATE TABLE IF NOT EXISTS via $executeRaw
      // O Prisma abre a conexão e cria o arquivo SQLite automaticamente
      const statements = CREATE_TABLES_SQL.split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      for (const stmt of statements) {
        try {
          await tempClient.$executeRawUnsafe(stmt)
        } catch (e) {
          // Ignora erros de "tabela já existe" (pode acontecer por race condition)
          const msg = e instanceof Error ? e.message : String(e)
          if (!msg.includes('already exists')) {
            console.error('[db] Erro em stmt:', msg)
          }
        }
      }
      console.log('[db] Tabelas verificadas/criadas com sucesso')
    } finally {
      await tempClient.$disconnect()
    }

    globalForPrisma.__dbInitialized = true
  } catch (e) {
    console.error('[db] Erro ao inicializar banco:', e)
  }
}

// Inicializa o banco de forma assíncrona (não bloqueia o boot)
// Marca como inicializado imediatamente para evitar concorrência,
// mas a inicialização real acontece em background
let initPromise: Promise<void> | null = null
function initDb() {
  if (!initPromise && !globalForPrisma.__dbInitialized) {
    initPromise = ensureDatabase().catch((e) => {
      console.error('[db] init error:', e)
      // Permite retry na próxima chamada
      initPromise = null
    })
  }
  return initPromise || Promise.resolve()
}
initDb()

export const db = globalForPrisma.prisma ?? createPrismaClient()

// Wrapper que garante que o banco está pronto antes de qualquer operação
// Útil em ambientes serverless onde a inicialização pode não ter completado
export async function getDb(): Promise<PrismaClient> {
  if (!globalForPrisma.__dbInitialized) {
    await initDb()
  }
  return db
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
