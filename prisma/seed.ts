// Seed script for TV Goiás portal
import { db } from '../src/lib/db'

async function main() {
  // Clean
  await db.news.deleteMany()
  await db.video.deleteMany()
  await db.category.deleteMany()

  // ============ NEWS ============
  const news = [
    {
      title: 'Goiás tem crescimento de 12% no setor de serviços',
      summary:
        'Resultados positivos foram impulsionados pelo comércio e serviços prestados às famílias, aponta pesquisa.',
      content:
        'O setor de serviços em Goiás registrou crescimento de 12% no último trimestre, segundo dados divulgados nesta terça-feira. Os resultados positivos foram impulsionados pelo comércio e serviços prestados às famílias, aponta pesquisa. Especialistas indicam que o desempenho é reflexo da melhoria no poder de compra do consumidor e do aquecimento da economia local. O governo do estado projeta que a tendência se mantenha pelos próximos meses, com incentivos adicionais ao setor produtivo.',
      category: 'Economia',
      imageUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      date: new Date('2024-07-23'),
      isLive: true,
      isFeatured: true,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 0,
      slug: 'goias-crescimento-12-por-cento-servicos',
    },
    {
      title: 'Câmara de Goiânia aprova novo projeto de mobilidade',
      summary:
        'Projeto prevê intervenções em avenidas principais e criação de ciclovias.',
      content:
        'A Câmara Municipal de Goiânia aprovou nesta segunda-feira um novo projeto de mobilidade urbana que prevê intervenções em avenidas principais e criação de ciclovias. A proposta agora segue para sanção do prefeito. O projeto contempla também melhorias no transporte público com a ampliação de corredores exclusivos para ônibus.',
      category: 'Política',
      imageUrl:
        'https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: true,
      isHighlight: false,
      hoursAgo: 0,
      slug: 'camara-goiania-projeto-mobilidade',
    },
    {
      title: 'Saúde de Goiás recebe reforço com novas ambulâncias',
      summary:
        'Novas ambulâncias foram entregues para municípios do interior do estado.',
      content:
        'A Secretaria de Saúde do Estado de Goiás entregou nesta segunda-feira um lote de novas ambulâncias para municípios do interior. O reforço faz parte do programa de ampliação do atendimento móvel de urgência (SAMU) e vai beneficiar dezenas de cidades.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=800&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: true,
      isHighlight: false,
      hoursAgo: 0,
      slug: 'saude-goias-novas-ambulancias',
    },
    {
      title: 'Inflação recua em junho e fecha trimestre com menor índice',
      summary:
        'Índice de preços ao consumidor apresentou queda pelo segundo mês consecutivo.',
      content:
        'A inflação em Goiás recuou em junho e fechou o trimestre com o menor índice dos últimos dois anos, segundo dados da FGV. A queda foi puxada pela redução nos preços de alimentos e combustíveis.',
      category: 'Economia',
      imageUrl:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: true,
      hoursAgo: 2,
      slug: 'inflacao-recua-junho-trimestre',
    },
    {
      title: 'Polícia Civil desarticula esquema de fraudes em aplicativos de banco',
      summary:
        'Operação cumpriu mandados em Goiânia e Aparecida de Goiânia.',
      content:
        'A Polícia Civil de Goiás desarticulou nesta segunda-feira um esquema de fraudes em aplicativos de banco. A operação cumpriu mandados de busca e apreensão em Goiânia e Aparecida de Goiânia.',
      category: 'Polícia',
      imageUrl:
        'https://images.unsplash.com/photo-1589992966055-69b6f5c2f7be?w=400&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: true,
      hoursAgo: 3,
      slug: 'policia-civil-fraudes-aplicativos-banco',
    },
    {
      title: 'Inscrições para o Enem 2024 começam na próxima semana',
      summary:
        'Participantes devem realizar a inscrição pelo site do INEP.',
      content:
        'As inscrições para o Exame Nacional do Ensino Médio (Enem) 2024 começam na próxima semana. Os participantes devem realizar a inscrição pelo site do INEP.',
      category: 'Educação',
      imageUrl:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: true,
      hoursAgo: 4,
      slug: 'inscricoes-enem-2024-proxima-semana',
    },
    {
      title: 'Atlético-GO vence e se afasta da zona de rebaixamento',
      summary:
        'Time goiano fez 2 a 0 fora de casa e respirou na tabela.',
      content:
        'O Atlético-GO venceu por 2 a 0 fora de casa e se afastou da zona de rebaixamento do Campeonato Brasileiro. O time goiano fez uma boa partida e comemorou o resultado importante.',
      category: 'Esporte',
      imageUrl:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: true,
      hoursAgo: 5,
      slug: 'atletico-go-vence-afasta-rebaixamento',
    },
  ]

  for (const n of news) {
    await db.news.create({ data: n })
  }

  // ============ VIDEOS ============
  const videos = [
    {
      title: 'Trânsito em Goiânia terá mudanças a partir de agosto',
      duration: '02:45',
      imageUrl:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
      youtubeId: 'dQw4w9WgXcQ',
      date: new Date('2024-07-23'),
    },
    {
      title: 'Rio Meia Ponte registra aumento no nível das águas',
      duration: '03:10',
      imageUrl:
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
      youtubeId: 'dQw4w9WgXcQ',
      date: new Date('2024-07-23'),
    },
    {
      title: 'Operação combate tráfico de drogas em Aparecida de Goiânia',
      duration: '01:50',
      imageUrl:
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
      youtubeId: 'dQw4w9WgXcQ',
      date: new Date('2024-07-23'),
    },
    {
      title: 'Escolas estaduais lançam projeto de tempo integral',
      duration: '02:30',
      imageUrl:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
      youtubeId: 'dQw4w9WgXcQ',
      date: new Date('2024-07-23'),
    },
  ]

  for (const v of videos) {
    await db.video.create({ data: v })
  }

  // ============ CATEGORIES ============
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

  for (const c of categories) {
    await db.category.create({ data: c })
  }

  console.log('Seed concluído com sucesso!')
  console.log(`  - ${news.length} notícias`)
  console.log(`  - ${videos.length} vídeos`)
  console.log(`  - ${categories.length} categorias`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
