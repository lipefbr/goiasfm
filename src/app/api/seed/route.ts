import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/requireAuth'
import bcrypt from 'bcryptjs'

// POST /api/seed - Popula o banco com dados de demonstração
// Requer login admin. Só popula se o banco estiver vazio (não sobrescreve).
export async function POST() {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const results = {
      users: 0,
      news: 0,
      videos: 0,
      categories: 0,
      settings: 0,
      skipped: [] as string[],
    }

    // ============ USER ADMIN ============
    const existingUser = await db.user.findFirst()
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await db.user.create({
        data: {
          email: 'admin@tvgoias.com',
          name: 'Administrador',
          password: hashedPassword,
          role: 'admin',
        },
      })
      results.users = 1
    } else {
      results.skipped.push('users (já existe)')
    }

    // ============ SETTINGS ============
    const existingSettings = await db.setting.findFirst()
    if (!existingSettings) {
      await db.setting.createMany({
        data: [
          {
            id: 'live_stream_url',
            value: 'https://wz5.dnip.com.br/tvgoias/tvgoias.sdp/playlist.m3u8',
          },
          {
            id: 'site_title',
            value: 'TV Goiás - Notícias do tamanho da verdade',
          },
        ],
      })
      results.settings = 2
    } else {
      results.skipped.push('settings (já existem)')
    }

    // ============ CATEGORIES ============
    const existingCategories = await db.category.findFirst()
    if (!existingCategories) {
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
      await db.category.createMany({ data: categories })
      results.categories = categories.length
    } else {
      results.skipped.push('categories (já existem)')
    }

    // ============ NEWS ============
    const existingNews = await db.news.findFirst()
    if (!existingNews) {
      const news = [
        {
          title: 'Goiás tem crescimento de 12% no setor de serviços',
          summary: 'Resultados positivos foram impulsionados pelo comércio e serviços prestados às famílias, aponta pesquisa.',
          content: 'O setor de serviços em Goiás registrou crescimento de 12% no último trimestre. Os resultados positivos foram impulsionados pelo comércio e serviços prestados às famílias, aponta pesquisa.',
          category: 'Economia',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 1, slug: 'goias-crescimento-12-por-cento-servicos',
        },
        {
          title: 'Câmara de Goiânia aprova novo projeto de mobilidade',
          summary: 'Projeto prevê intervenções em avenidas principais e criação de ciclovias.',
          content: 'A Câmara Municipal de Goiânia aprovou um novo projeto de mobilidade urbana que prevê intervenções em avenidas principais e criação de ciclovias.',
          category: 'Política',
          imageUrl: 'https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: true, isHighlight: false,
          hoursAgo: 2, slug: 'camara-goiania-projeto-mobilidade',
        },
        {
          title: 'Saúde de Goiás recebe reforço com novas ambulâncias',
          summary: 'Novas ambulâncias foram entregues para municípios do interior do estado.',
          content: 'A Secretaria de Saúde do Estado de Goiás entregou um lote de novas ambulâncias para municípios do interior.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: true, isHighlight: false,
          hoursAgo: 3, slug: 'saude-goias-novas-ambulancias',
        },
        {
          title: 'Inflação recua em junho e fecha trimestre com menor índice',
          summary: 'Índice de preços ao consumidor apresentou queda pelo segundo mês consecutivo.',
          content: 'A inflação em Goiás recuou em junho e fechou o trimestre com o menor índice dos últimos dois anos.',
          category: 'Economia',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: true,
          hoursAgo: 2, slug: 'inflacao-recua-junho-trimestre',
        },
        {
          title: 'Polícia Civil desarticula esquema de fraudes em aplicativos de banco',
          summary: 'Operação cumpriu mandados em Goiânia e Aparecida de Goiânia.',
          content: 'A Polícia Civil de Goiás desarticulou um esquema de fraudes em aplicativos de banco.',
          category: 'Polícia',
          imageUrl: 'https://images.unsplash.com/photo-1589992957537-3d2c4c1f5b87?w=400&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: true,
          hoursAgo: 3, slug: 'policia-civil-fraudes-aplicativos-banco',
        },
        {
          title: 'Inscrições para o Enem 2024 começam na próxima semana',
          summary: 'Participantes devem realizar a inscrição pelo site do INEP.',
          content: 'As inscrições para o Exame Nacional do Ensino Médio (Enem) 2024 começam na próxima semana.',
          category: 'Educação',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: true,
          hoursAgo: 4, slug: 'inscricoes-enem-2024-proxima-semana',
        },
        {
          title: 'Atlético-GO vence e se afasta da zona de rebaixamento',
          summary: 'Time goiano fez 2 a 0 fora de casa e respirou na tabela.',
          content: 'O Atlético-GO venceu por 2 a 0 fora de casa e se afastou da zona de rebaixamento.',
          category: 'Esporte',
          imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: true,
          hoursAgo: 5, slug: 'atletico-go-vence-afasta-rebaixamento',
        },
        {
          title: 'Goiânia registra novo recorde de temperatura no verão',
          summary: 'Termômetros passaram dos 38°C e batem recorde histórico para o mês.',
          content: 'Goiânia registrou um novo recorde de temperatura para o mês, com termômetros passando dos 38°C.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1504370805625-d32af4583c8a?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 6, slug: 'goiania-recorde-temperatura-verao',
        },
        {
          title: 'Novo hospital é inaugurado em Anápolis',
          summary: 'Unidade conta com 80 leitos e vai atender mais de 200 mil habitantes.',
          content: 'Foi inaugurado em Anápolis um novo hospital público com 80 leitos.',
          category: 'Saúde',
          imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 7, slug: 'novo-hospital-anapolis-inaugurado',
        },
        {
          title: 'Feira de tecnologia reúne startups goianas em Goiânia',
          summary: 'Evento traz mais de 100 expositores e espera receber 20 mil visitantes.',
          content: 'A maior feira de tecnologia do Centro-Oeste começou em Goiânia.',
          category: 'Tecnologia',
          imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 8, slug: 'feira-tecnologia-startups-goianas',
        },
        {
          title: 'Festival de cinema goiano abre inscrições para curtas',
          summary: 'Produtos audiovisuais podem ser inscritos até o dia 30 de agosto.',
          content: 'O Festival de Cinema de Goiás abriu as inscrições para a mostra competitiva de curtas-metragens.',
          category: 'Entretenimento',
          imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 9, slug: 'festival-cinema-goiano-inscricoes-curtas',
        },
        {
          title: 'Governo de Goiás anuncia pacote de obras para o interior',
          summary: 'Investimento de R$ 500 milhões contempla 50 municípios goianos.',
          content: 'O governador de Goiás anunciou um pacote de obras para o interior do estado.',
          category: 'Política',
          imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 10, slug: 'governo-goias-obras-interior',
        },
        {
          title: 'Volkswagen anuncia ampliação de fábrica em Taubaté',
          summary: 'Investimento de R$ 1,2 bilhão deve gerar 800 empregos diretos.',
          content: 'A Volkswagen anunciou a ampliação de sua fábrica em Taubaté.',
          category: 'Economia',
          imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 11, slug: 'volkswagen-ampliacao-fabrica-taubate',
        },
        {
          title: 'Brasil sediará Copa do Mundo de futebol feminino em 2027',
          summary: 'País foi escolhido por unanimidade em votação da FIFA.',
          content: 'O Brasil foi escolhido por unanimidade para sediar a Copa do Mundo de futebol feminino de 2027.',
          category: 'Brasil e Mundo',
          imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 12, slug: 'brasil-sede-copa-mundo-feminino-2027',
        },
        {
          title: 'PRF recupera carga roubada avaliada em R$ 2 milhões em GO',
          summary: 'Caminhão foi interceptado na BR-060 após perseguição de 30 km.',
          content: 'A Polícia Rodoviária Federal recuperou uma carga roubada avaliada em R$ 2 milhões na BR-060.',
          category: 'Polícia',
          imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 13, slug: 'prf-recupera-carga-roubada-br-060',
        },
        {
          title: 'Universidade Federal de Goiás abre vagas para curso de verão',
          summary: 'Inscrições vão até 10 de agosto para cursos gratuitos.',
          content: 'A UFG abriu as inscrições para o curso de verão, com disciplinas gratuitas de extensão.',
          category: 'Educação',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
          date: new Date('2024-07-23'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 14, slug: 'ufg-curso-verao-inscricoes',
        },
        {
          title: 'Goiano vence etapa do circuito mundial de surf nas Maldivas',
          summary: 'Atleta de Goiás conquista primeiro título internacional.',
          content: 'O surfista goiano Lucas Chumbo conquistou a primeira vitória internacional da carreira.',
          category: 'Esporte',
          imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 16, slug: 'goiano-vence-surf-maldivas',
        },
        {
          title: 'Câmara aprova projeto que cria ciclofaixa na Av. T-9',
          summary: 'Obra deve ser concluída em 6 meses e vai ligar dois parques.',
          content: 'A Câmara Municipal de Goiânia aprovou o projeto que cria uma ciclofaixa na Avenida T-9.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 18, slug: 'camara-ciclofaixa-avenida-t9',
        },
        {
          title: 'Inmetro autoriza reajuste de até 5% na tarifa de ônibus',
          summary: 'Novo valor começa a valer a partir do dia 1º de agosto.',
          content: 'O Inmetro autorizou um reajuste de até 5% na tarifa de ônibus em Goiânia.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 20, slug: 'inmetro-reajuste-onibus-goiania',
        },
        {
          title: 'Detran-GO prorroga prazo para renovação de CNH vencida',
          summary: 'Motoristas têm até 31 de agosto para regularizar.',
          content: 'O Detran-GO prorrogou até o dia 31 de agosto o prazo para renovação de CNHs vencidas.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 22, slug: 'detran-go-prorroga-cnh',
        },
        {
          title: 'Empresários de Goiás pedem redução de impostos',
          summary: 'Fecomércio defende desoneração da folha de pagamento.',
          content: 'Em audiência pública, empresários goianos pediram a redução de impostos.',
          category: 'Economia',
          imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 24, slug: 'empresarios-goias-reducao-impostos',
        },
        {
          title: 'Polícia Militar prende foragido da justiça em Anápolis',
          summary: 'Suspeito era procurado por tráfico de drogas há 2 anos.',
          content: 'A Polícia Militar prendeu em Anápolis um foragido da justiça procurado por tráfico de drogas.',
          category: 'Polícia',
          imageUrl: 'https://images.unsplash.com/photo-1589992957537-3d2c4c1f5b87?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 26, slug: 'pm-prende-foragido-anapolis',
        },
        {
          title: 'Concurso público da Prefeitura de Goiânia tem 3,5 mil inscrições',
          summary: 'Vagas são para níveis fundamental, médio e superior.',
          content: 'O concurso público da Prefeitura de Goiânia já registra 3,5 mil inscrições.',
          category: 'Cidades',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 28, slug: 'concurso-prefeitura-goiania-inscricoes',
        },
        {
          title: 'Teatro Goiânia recebe espetáculo gratuito',
          summary: 'Apresentação marca os 80 anos do prédio histórico.',
          content: 'O Teatro Goiânia recebe um espetáculo gratuito para marcar os 80 anos do prédio histórico.',
          category: 'Entretenimento',
          imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 30, slug: 'teatro-goiania-espetaculo-gratuito',
        },
        {
          title: 'Câmara dos Deputados aprova Marco Legal das Startups',
          summary: 'Projeto agora segue para sanção presidencial.',
          content: 'A Câmara dos Deputados aprovou o Marco Legal das Startups.',
          category: 'Brasil e Mundo',
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
          date: new Date('2024-07-22'),
          isLive: false, isFeatured: false, isSecondary: false, isHighlight: false,
          hoursAgo: 32, slug: 'camara-marco-legal-startups',
        },
      ]

      for (const n of news) {
        await db.news.create({ data: n })
      }
      results.news = news.length
    } else {
      results.skipped.push('news (já existem)')
    }

    // ============ VIDEOS ============
    const existingVideos = await db.video.findFirst()
    if (!existingVideos) {
      const videos = [
        {
          title: 'Trânsito em Goiânia terá mudanças a partir de agosto',
          duration: '02:45',
          imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
          youtubeId: 'dQw4w9WgXcQ',
          date: new Date('2024-07-23'),
        },
        {
          title: 'Rio Meia Ponte registra aumento no nível das águas',
          duration: '03:10',
          imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
          youtubeId: 'dQw4w9WgXcQ',
          date: new Date('2024-07-23'),
        },
        {
          title: 'Operação combate tráfico de drogas em Aparecida',
          duration: '01:50',
          imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
          youtubeId: 'dQw4w9WgXcQ',
          date: new Date('2024-07-23'),
        },
        {
          title: 'Escolas estaduais lançam projeto de tempo integral',
          duration: '02:30',
          imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
          youtubeId: 'dQw4w9WgXcQ',
          date: new Date('2024-07-23'),
        },
      ]
      await db.video.createMany({ data: videos })
      results.videos = videos.length
    } else {
      results.skipped.push('videos (já existem)')
    }

    return NextResponse.json({
      success: true,
      message: 'Banco populado com dados de demonstração',
      results,
    })
  } catch (error) {
    console.error('[POST /api/seed] error:', error)
    return NextResponse.json(
      {
        error: 'Erro ao popular banco',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// GET /api/seed - Retorna status do banco (conta registros)
export async function GET() {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const [users, news, videos, categories, settings] = await Promise.all([
      db.user.count(),
      db.news.count(),
      db.video.count(),
      db.category.count(),
      db.setting.count(),
    ])

    return NextResponse.json({
      counts: { users, news, videos, categories, settings },
      isEmpty: users + news + videos + categories + settings === 0,
    })
  } catch (error) {
    console.error('[GET /api/seed] error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar banco' },
      { status: 500 }
    )
  }
}
