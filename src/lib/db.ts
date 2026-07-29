import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  __dbInitialized: boolean | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    // Log só em desenvolvimento para não poluir logs de produção
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
  })
}

/**
 * Garante que o banco de dados SQLite existe e tem as tabelas criadas.
 * Necessário em ambientes de deploy (como Lipe.Host) que rodam `next build`
 * mas não rodam `prisma db push` automaticamente.
 *
 * Esta função é idempotente: só faz algo se o banco não existir ou se
 * faltarem tabelas.
 */
function ensureDatabase() {
  if (globalForPrisma.__dbInitialized) return

  try {
    const dbUrl = process.env.DATABASE_URL || ''

    // Só aplica a lógica de auto-criação para SQLite (file:...)
    if (dbUrl.startsWith('file:')) {
      // Extrai o caminho do arquivo do DATABASE_URL
      // Formato: file:./db/custom.db ou file:/abs/path/custom.db
      let dbPath = dbUrl.replace(/^file:/, '')
      if (dbPath.startsWith('./')) dbPath = dbPath.substring(2)

      // Se for caminho relativo, resolve a partir do cwd
      if (!path.isAbsolute(dbPath)) {
        dbPath = path.join(process.cwd(), dbPath)
      }

      const dbDir = path.dirname(dbPath)

      // Cria o diretório se não existir
      if (!existsSync(dbDir)) {
        try {
          mkdirSync(dbDir, { recursive: true })
        } catch (e) {
          console.error('[db] Erro ao criar diretório do banco:', e)
        }
      }

      // Se o arquivo do banco não existe, roda prisma db push para criar
      if (!existsSync(dbPath)) {
        console.log('[db] Banco não encontrado. Criando tabelas via prisma db push...')
        try {
          execSync('npx prisma db push --skip-generate --accept-data-loss', {
            stdio: 'pipe',
            cwd: process.cwd(),
            env: process.env,
            timeout: 30000,
          })
          console.log('[db] Tabelas criadas com sucesso!')
        } catch (e) {
          console.error('[db] Erro ao criar tabelas (prisma db push):', e)
          // Não joga erro — deixa o Prisma tentar conectar e falhar com mensagem clara
        }
      }
    }

    globalForPrisma.__dbInitialized = true
  } catch (e) {
    console.error('[db] Erro ao verificar/inicializar banco:', e)
    // Não joga erro — deixa o Prisma tentar
  }
}

// Garante o banco antes de criar o client
ensureDatabase()

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
