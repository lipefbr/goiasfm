import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'

// GET /api/init - Inicializa o banco de dados FORÇADAMENTE.
// Cria tabelas (CREATE TABLE IF NOT EXISTS) e popula com dados básicos.
// É PÚBLICO (sem auth) para resolver o problema "ovo e galinha".
// Seguro porque só preenche tabelas vazias.
export async function GET() {
  const logs: string[] = []

  try {
    logs.push('Iniciando criação do banco...')

    // 1. Garante que o diretório do banco existe
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
          logs.push(`Diretório criado: ${dbDir}`)
        } catch (e) {
          logs.push(`Erro ao criar diretório: ${e}`)
        }
      } else {
        logs.push(`Diretório já existe: ${dbDir}`)
      }
      logs.push(`Caminho do banco: ${dbPath}`)
      logs.push(`Banco existe: ${existsSync(dbPath)}`)
    }

    // 2. Cria PrismaClient próprio (sem depender do db.ts)
    logs.push('Criando PrismaClient...')
    const prisma = new PrismaClient({
      log: ['error'],
    })

    try {
      // 3. Cria as tabelas via SQL bruto (CREATE TABLE IF NOT EXISTS)
      logs.push('Criando tabelas via SQL...')
      const statements = [
        `CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'admin',
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,

        `CREATE TABLE IF NOT EXISTS "News" (
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
        )`,
        `CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News"("slug")`,

        `CREATE TABLE IF NOT EXISTS "Video" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "duration" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "youtubeId" TEXT,
          "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "icon" TEXT NOT NULL,
          "order" INTEGER NOT NULL DEFAULT 0
        )`,

        `CREATE TABLE IF NOT EXISTS "Setting" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "value" TEXT NOT NULL
        )`,
      ]

      for (const stmt of statements) {
        try {
          await prisma.$executeRawUnsafe(stmt)
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e)
          if (!msg.includes('already exists')) {
            logs.push(`Erro em stmt: ${msg}`)
          }
        }
      }
      logs.push('Tabelas criadas/verificadas com sucesso')

      // 4. Conta registros existentes
      const userCount = await prisma.user.count()
      const newsCount = await prisma.news.count()
      const settingCount = await prisma.setting.count()
      const categoryCount = await prisma.category.count()
      logs.push(`Registros: users=${userCount}, news=${newsCount}, settings=${settingCount}, categories=${categoryCount}`)

      // 5. Se não tem usuário, cria admin + dados básicos
      if (userCount === 0) {
        logs.push('Criando usuário admin...')
        const hashedPassword = await bcrypt.hash('admin123', 10)
        await prisma.user.create({
          data: {
            email: 'admin@tvgoias.com',
            name: 'Administrador',
            password: hashedPassword,
            role: 'admin',
          },
        })
        logs.push('Usuário admin criado: admin@tvgoias.com / admin123')
      }

      // 6. Cria settings se não existirem
      if (settingCount === 0) {
        logs.push('Criando settings...')
        await prisma.setting.createMany({
          data: [
            {
              id: 'live_stream_url',
              value: 'https://wz5.dnip.com.br/tvgoias/tvgoias.sdp/playlist.m3u8',
            },
            {
              id: 'site_title',
              value: 'TV Goiás - Notícias do tamanho da verdade',
            },
            { id: 'setup_disabled', value: 'false' },
            { id: 'favicon_url', value: '/favicon.png' },
          ],
        })
        logs.push('Settings criados (4)')
      }

      // 7. Cria categorias se não existirem
      if (categoryCount === 0) {
        logs.push('Criando categorias...')
        const categories = [
          { name: 'Política', icon: 'Landmark', order: 1 },
          { name: 'Saúde', icon: 'Heart', order: 2 },
          { name: 'Economia', icon: 'TrendingUp', order: 3 },
          { name: 'Esporte', icon: 'Trophy', order: 4 },
          { name: 'Cidades', icon: 'Building2', order: 5 },
          { name: 'Entretenimento', icon: 'Drama', order: 6 },
          { name: 'Polícia', icon: 'Shield', order: 7 },
          { name: 'Tecnologia', icon: 'Monitor', order: 8 },
          { name: 'Educação', icon: 'GraduationCap', order: 9 },
          { name: 'Brasil e Mundo', icon: 'Globe', order: 10 },
        ]
        await prisma.category.createMany({ data: categories })
        logs.push(`Categorias criadas (${categories.length})`)
      }

      // 8. Cria notícias de demonstração se não existirem
      if (newsCount === 0) {
        logs.push('Criando notícias de demonstração...')
        const news = [
          {
            title: 'Câmara de Goiânia aprova novo projeto de mobilidade',
            summary: 'Projeto prevê intervenções em avenidas principais e criação de ciclovias.',
            content: 'A Câmara Municipal de Goiânia aprovou um novo projeto de mobilidade urbana.',
            category: 'Política',
            imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&q=80',
            date: new Date(),
            isSecondary: true, isHighlight: false, isFeatured: false,
            hoursAgo: 2, slug: `camara-goiania-projeto-mobilidade-${Date.now()}`,
          },
          {
            title: 'Saúde de Goiás recebe reforço com novas ambulâncias',
            summary: 'Novas ambulâncias foram entregues para municípios do interior.',
            content: 'A Secretaria de Saúde entregou novas ambulâncias.',
            category: 'Cidades',
            imageUrl: 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80',
            date: new Date(),
            isSecondary: true, isHighlight: false, isFeatured: false,
            hoursAgo: 3, slug: `saude-goias-novas-ambulancias-${Date.now()}`,
          },
          {
            title: 'Inflação recua em junho e fecha trimestre com menor índice',
            summary: 'Índice de preços ao consumidor apresentou queda pelo segundo mês.',
            content: 'A inflação em Goiás recuou em junho.',
            category: 'Economia',
            imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
            date: new Date(),
            isSecondary: false, isHighlight: true, isFeatured: false,
            hoursAgo: 2, slug: `inflacao-recua-junho-trimestre-${Date.now()}`,
          },
          {
            title: 'Polícia Civil desarticula esquema de fraudes em bancos',
            summary: 'Operação cumpriu mandados em Goiânia e Aparecida.',
            content: 'A Polícia Civil desarticulou um esquema de fraudes.',
            category: 'Polícia',
            imageUrl: 'https://images.unsplash.com/photo-1589992957537-3d2c4c1f5b87?w=400&q=80',
            date: new Date(),
            isSecondary: false, isHighlight: true, isFeatured: false,
            hoursAgo: 3, slug: `policia-civil-fraudes-bancos-${Date.now()}`,
          },
          {
            title: 'Inscrições para o Enem 2024 começam na próxima semana',
            summary: 'Participantes devem realizar a inscrição pelo site do INEP.',
            content: 'As inscrições para o Enem 2024 começam na próxima semana.',
            category: 'Educação',
            imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
            date: new Date(),
            isSecondary: false, isHighlight: true, isFeatured: false,
            hoursAgo: 4, slug: `inscricoes-enem-2024-semana-${Date.now()}`,
          },
          {
            title: 'Atlético-GO vence e se afasta da zona de rebaixamento',
            summary: 'Time goiano fez 2 a 0 fora de casa.',
            content: 'O Atlético-GO venceu por 2 a 0 fora de casa.',
            category: 'Esporte',
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
            date: new Date(),
            isSecondary: false, isHighlight: true, isFeatured: false,
            hoursAgo: 5, slug: `atletico-go-vence-rebaixamento-${Date.now()}`,
          },
        ]
        for (const n of news) {
          await prisma.news.create({ data: n })
        }
        logs.push(`Notícias criadas (${news.length})`)
      }

      // Contagem final
      const finalCounts = {
        users: await prisma.user.count(),
        news: await prisma.news.count(),
        videos: await prisma.video.count(),
        categories: await prisma.category.count(),
        settings: await prisma.setting.count(),
      }
      logs.push(`Contagem final: ${JSON.stringify(finalCounts)}`)

      return NextResponse.json({
        success: true,
        message: 'Banco inicializado com sucesso!',
        logs,
        counts: finalCounts,
        credentials: {
          email: 'admin@tvgoias.com',
          password: 'admin123',
        },
      })
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('[/api/init] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao inicializar banco',
        details: error instanceof Error ? error.message : String(error),
        logs,
      },
      { status: 500 }
    )
  }
}
