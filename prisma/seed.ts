// Seed script for TV Goiás portal
import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  // Clean
  await db.news.deleteMany()
  await db.video.deleteMany()
  await db.category.deleteMany()
  await db.setting.deleteMany()
  await db.user.deleteMany()

  // ============ USER ADMIN ============
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await db.user.create({
    data: {
      email: 'admin@tvgoias.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('Usuário admin criado: admin@tvgoias.com / admin123')

  // ============ SETTINGS (link do stream ao vivo) ============
  await db.setting.create({
    data: {
      id: 'live_stream_url',
      value: 'https://wz5.dnip.com.br/tvgoias/tvgoias.sdp/playlist.m3u8',
    },
  })

  await db.setting.create({
    data: {
      id: 'site_title',
      value: 'TV Goiás - Notícias do tamanho da verdade',
    },
  })

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
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 1,
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
    // ===== Mais notícias para a seção inferior =====
    {
      title: 'Goiânia registra novo recorde de temperatura no verão',
      summary:
        'Termômetros passaram dos 38°C e batem recorde histórico para o mês.',
      content:
        'Goiânia registrou nesta terça-feira um novo recorde de temperatura para o mês, com termômetros passando dos 38°C. Segundo o Instituto Nacional de Meteorologia (Inmet), a previsão é de que as altas temperaturas se mantenham pelos próximos dias. A orientação é de hidratação constante e evitar exposição ao sol entre 10h e 16h.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1504370805625-d32af4583c8a?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 6,
      slug: 'goiania-recorde-temperatura-verao',
    },
    {
      title: 'Novo hospital é inaugurado em Anápolis',
      summary:
        'Unidade conta com 80 leitos e vai atender mais de 200 mil habitantes.',
      content:
        'Foi inaugurado nesta segunda-feira em Anápolis, na região metropolitana de Goiânia, um novo hospital público com 80 leitos. A unidade vai atender mais de 200 mil habitantes da região e conta com emergência, centro cirúrgico e UTI. O investimento foi de R$ 35 milhões.',
      category: 'Saúde',
      imageUrl:
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 7,
      slug: 'novo-hospital-anapolis-inaugurado',
    },
    {
      title: 'Feira de tecnologia reúne startups goianas em Goiânia',
      summary:
        'Evento traz mais de 100 expositores e espera receber 20 mil visitantes.',
      content:
        'A maior feira de tecnologia do Centro-Oeste começou nesta terça-feira em Goiânia. O evento reúne mais de 100 startups goianas e espera receber 20 mil visitantes ao longo de três dias. Há palestras, workshops e espaços de networking para empreendedores e investidores.',
      category: 'Tecnologia',
      imageUrl:
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 8,
      slug: 'feira-tecnologia-startups-goianas',
    },
    {
      title: 'Festival de cinema goiano abre inscrições para curtas',
      summary:
        'Produtos audiovisuais podem ser inscritos até o dia 30 de agosto.',
      content:
        'O Festival de Cinema de Goiás abriu as inscrições para a mostra competitiva de curtas-metragens. Produtores audiovisuais do estado podem inscrever suas obras até o dia 30 de agosto. As obras selecionadas serão exibidas em sessões gratuitas em Goiânia e no interior.',
      category: 'Entretenimento',
      imageUrl:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 9,
      slug: 'festival-cinema-goiano-inscricoes-curtas',
    },
    {
      title: 'Governo de Goiás anuncia pacote de obras para o interior',
      summary:
        'Investimento de R$ 500 milhões contempla 50 municípios goianos.',
      content:
        'O governador de Goiás anunciou nesta terça-feira um pacote de obras para o interior do estado, com investimento de R$ 500 milhões. O programa contempla 50 municípios goianos e prevê pavimentação, saneamento e construção de escolas e unidades de saúde.',
      category: 'Política',
      imageUrl:
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 10,
      slug: 'governo-goias-obras-interior',
    },
    {
      title: 'Volkswagen anuncia ampliação de fábrica em Taubaté',
      summary:
        'Investimento de R$ 1,2 bilhão deve gerar 800 empregos diretos.',
      content:
        'A Volkswagen anunciou a ampliação de sua fábrica em Taubaté, com investimento de R$ 1,2 bilhão. A expansão deve gerar 800 empregos diretos e outros 2.000 indiretos. A produção de um novo modelo compacto está prevista para começar em 2026.',
      category: 'Economia',
      imageUrl:
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 11,
      slug: 'volkswagen-ampliacao-fabrica-taubate',
    },
    {
      title: 'Brasil sediará Copa do Mundo de futebol feminino em 2027',
      summary:
        'País foi escolhido por unanimidade em votação da FIFA nesta semana.',
      content:
        'O Brasil foi escolhido por unanimidade para sediar a Copa do Mundo de futebol feminino de 2027. A decisão foi tomada pela FIFA em votação realizada nesta semana. Será a primeira vez que o país receberá o torneio feminino, com jogos previstos em várias cidades.',
      category: 'Brasil e Mundo',
      imageUrl:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 12,
      slug: 'brasil-sede-copa-mundo-feminino-2027',
    },
    {
      title: 'PRF recupera carga roubada avaliada em R$ 2 milhões em GO',
      summary:
        'Caminhão foi interceptado na BR-060 após perseguição de 30 km.',
      content:
        'A Polícia Rodoviária Federal recuperou nesta terça-feira uma carga roubada avaliada em R$ 2 milhões na BR-060, em Goiás. O caminhão foi interceptado após uma perseguição de 30 km. Dois suspeitos foram presos e a carga será devolvida à empresa de logística.',
      category: 'Polícia',
      imageUrl:
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 13,
      slug: 'prf-recupera-carga-roubada-br-060',
    },
    {
      title: 'Universidade Federal de Goiás abre vagas para curso de verão',
      summary:
        'Inscrições vão até 10 de agosto para cursos gratuitos de extensão.',
      content:
        'A Universidade Federal de Goiás (UFG) abriu as inscrições para o curso de verão, que oferece disciplinas gratuitas de extensão para a comunidade. As inscrições vão até o dia 10 de agosto e as aulas começam em setembro. Há opções nas áreas de humanidades, exatas e biológicas.',
      category: 'Educação',
      imageUrl:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
      date: new Date('2024-07-23'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 14,
      slug: 'ufg-curso-verao-inscricoes',
    },
    // ===== Mais notícias extras para o botão "Ver Mais" =====
    {
      title: 'Goiano vence etapa do circuito mundial de surf nas Maldivas',
      summary:
        'Atleta de Goiás conquista primeiro título internacional da carreira.',
      content:
        'O surfista goiano Lucas Chumbo conquistou nesta segunda-feira a primeira vitória internacional da carreira ao vencer uma etapa do circuito mundial nas Maldivas. O atleta de 24 anos dominou a final com duas ondas de nota 9 e levantou a bandeira do Brasil no pódio.',
      category: 'Esporte',
      imageUrl:
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 16,
      slug: 'goiano-vence-surf-maldivas',
    },
    {
      title: 'Câmara aprova projeto que cria ciclofaixa na Av. T-9',
      summary:
        'Obra deve ser concluída em 6 meses e vai ligar dois parques da cidade.',
      content:
        'A Câmara Municipal de Goiânia aprovou em segundo turno o projeto que cria uma ciclofaixa na Avenida T-9, no Setor Bueno. A obra tem prazo de 6 meses para conclusão e vai ligar o Parque Vaca Brava ao Parque Areião, criando um corredor cicloviário de 4,2 km.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 18,
      slug: 'camara-ciclofaixa-avenida-t9',
    },
    {
      title: 'Inmetro autoriza reajuste de até 5% na tarifa de ônibus em Goiânia',
      summary:
        'Novo valor começa a valer a partir do dia 1º de agosto.',
      content:
        'O Inmetro autorizou um reajuste de até 5% na tarifa de ônibus em Goiânia. O novo valor, que passará de R$ 5,50 para R$ 5,80, começa a valer a partir do dia 1º de agosto. O reajuste foi justificado pelo aumento dos custos com combustível e manutenção da frota.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 20,
      slug: 'inmetro-reajuste-onibus-goiania',
    },
    {
      title: 'Detran-GO prorroga prazo para renovação de CNH vencida',
      summary:
        'Motoristas têm até 31 de agosto para regularizar a habilitação.',
      content:
        'O Detran-GO prorrogou até o dia 31 de agosto o prazo para renovação de CNHs vencidas nos meses de março a julho. A medida atende mais de 80 mil motoristas em situação irregular. O processo pode ser feito totalmente online pelo site do Detran.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 22,
      slug: 'detran-go-prorroga-cnh',
    },
    {
      title: 'Empresários de Goiás pedem redução de impostos em audiência pública',
      summary:
        'Fecomércio defende desoneração da folha de pagamento.',
      content:
        'Em audiência pública realizada na Assembleia Legislativa, empresários goianos pediram a redução de impostos para estimular a economia do estado. A Fecomércio defendeu a desoneração da folha de pagamento e a simplificação tributária para micro e pequenas empresas.',
      category: 'Economia',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 24,
      slug: 'empresarios-goias-reducao-impostos',
    },
    {
      title: 'Polícia Militar prende foragido da justiça em Anápolis',
      summary:
        'Suspeito era procurado por tráfico de drogas há mais de 2 anos.',
      content:
        'A Polícia Militar prendeu na manhã desta segunda-feira em Anápolis um foragido da justiça que era procurado por tráfico de drogas há mais de 2 anos. O suspeito de 32 anos foi localizado em uma casa na periferia da cidade e não ofereceu resistência.',
      category: 'Polícia',
      imageUrl:
        'https://images.unsplash.com/photo-1589992957537-3d2c4c1f5b87?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 26,
      slug: 'pm-prende-foragido-anapolis',
    },
    {
      title: 'Concurso público da Prefeitura de Goiânia tem 3,5 mil inscrições',
      summary:
        'Vagas são para níveis fundamental, médio e superior.',
      content:
        'O concurso público da Prefeitura de Goiânia já registra 3,5 mil inscrições. As vagas são para níveis fundamental, médio e superior, com salários de até R$ 6.500. As inscrições seguem abertas até o dia 15 de agosto pelo site da organizadora.',
      category: 'Cidades',
      imageUrl:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 28,
      slug: 'concurso-prefeitura-goiania-inscricoes',
    },
    {
      title: 'Teatro Goiânia recebe espetáculo gratuito neste fim de semana',
      summary:
        'Apresentação marca os 80 anos do prédio histórico.',
      content:
        'O Teatro Goiânia, um dos mais antigos do estado, recebe neste fim de semana um espetáculo gratuito para marcar os 80 anos do prédio histórico. A apresentação reúne música, dança e teatro e acontece nos dias 27 e 28 de julho, sempre às 19h.',
      category: 'Entretenimento',
      imageUrl:
        'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 30,
      slug: 'teatro-goiania-espetaculo-gratuito',
    },
    {
      title: 'Câmara dos Deputados aprova Marco Legal das Startups',
      summary:
        'Projeto agora segue para sanção presidencial.',
      content:
        'A Câmara dos Deputados aprovou nesta segunda-feira o Marco Legal das Startups. O projeto facilita a abertura de empresas de base tecnológica e cria um regime tributário simplificado. A matéria agora segue para sanção presidencial.',
      category: 'Brasil e Mundo',
      imageUrl:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
      date: new Date('2024-07-22'),
      isLive: false,
      isFeatured: false,
      isSecondary: false,
      isHighlight: false,
      hoursAgo: 32,
      slug: 'camara-marco-legal-startups',
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
