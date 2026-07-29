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
 * Cria todas as tabelas do schema usando SQL direto via better-sqlite3.
 * Usa CREATE TABLE IF NOT EXISTS — não destrói tabelas existentes.
 */
async function createTablesViaSqlite(dbPath: string) {
  try {
    // Import dinâmico para evitar erro de lint com require
    const Database = (await import('better-sqlite3')).default
    const db = new Database(dbPath)

    db.exec(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'admin',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "User_email_key" UNIQUE ("email")
      );

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
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "News_slug_key" UNIQUE ("slug")
      );

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
    `)

    db.close()
  } catch (e) {
    console.error('[db] Erro ao criar tabelas via SQLite direto:', e)
  }
}

/**
 * Verifica se as tabelas existem. Se faltar alguma, cria.
 */
async function ensureTablesExist(dbPath: string) {
  try {
    const Database = (await import('better-sqlite3')).default
    const db = new Database(dbPath, { readonly: false })

    const result = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='User'"
    ).get() as { name: string } | undefined

    if (!result) {
      console.log('[db] Tabelas não encontradas. Criando...')
      await createTablesViaSqlite(dbPath)
    }

    db.close()
  } catch (e) {
    console.error('[db] Erro ao verificar tabelas:', e)
  }
}

/**
 * Garante que o banco de dados SQLite existe e tem as tabelas criadas.
 *
 * IMPORTANTE: NÃO usa 'prisma db push --accept-data-loss' porque isso
 * pode apagar dados em produção. Em vez disso, usa SQL CREATE TABLE IF NOT
 * EXISTS diretamente — só cria tabelas que ainda não existem, preservando
 * dados existentes.
 */
async function ensureDatabase() {
  if (globalForPrisma.__dbInitialized) return

  try {
    const dbUrl = process.env.DATABASE_URL || ''

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
          console.error('[db] Erro ao criar diretório do banco:', e)
        }
      }

      if (!existsSync(dbPath)) {
        console.log('[db] Banco não encontrado. Criando banco e tabelas...')
        await createTablesViaSqlite(dbPath)
        console.log('[db] Banco criado com sucesso!')
      } else {
        await ensureTablesExist(dbPath)
      }
    }

    globalForPrisma.__dbInitialized = true
  } catch (e) {
    console.error('[db] Erro ao verificar/inicializar banco:', e)
  }
}

// Inicializa o banco de forma assíncrona (não bloqueia o boot)
ensureDatabase().catch((e) => console.error('[db] init error:', e))

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

