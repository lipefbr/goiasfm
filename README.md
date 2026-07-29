# TV Goiás - Portal de Notícias

Portal de notícias com player de TV ao vivo (HLS), sistema de notícias, painel admin protegido por login, e responsivo mobile/desktop.

## 🚀 Deploy na Vercel

### 1. Variáveis de Ambiente (configure na Vercel)

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `file:./db/custom.db` (SQLite) **ou** URL do Vercel Postgres |
| `NEXTAUTH_SECRET` | Gere com `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` |

### 2. Deploy

```bash
# Opção A: via CLI
npm i -g vercel
vercel

# Opção B: via Dashboard
# 1. Importe o repositório no https://vercel.com/new
# 2. Configure as variáveis de ambiente
# 3. Deploy
```

### 3. Após o primeiro deploy

Execute o seed para criar o usuário admin e notícias iniciais:

```bash
# Localmente com DATABASE_URL apontando para produção
DATABASE_URL="sua-url-de-produção" bun run seed
```

**Login admin padrão:**
- Email: `admin@tvgoias.com`
- Senha: `admin123`
- ⚠️ **Troque a senha após o primeiro login!**

## 🛠️ Desenvolvimento Local

```bash
bun install
bun run db:push
bun run seed
bun run dev
```

Acesse http://localhost:3000

## 📁 Estrutura

```
src/
├── app/
│   ├── page.tsx                    # Home (player + notícias)
│   ├── noticia/[slug]/             # Página individual de notícia (SSR)
│   ├── admin/                      # Painel admin (protegido)
│   ├── login/                      # Página de login
│   └── api/
│       ├── news/                   # CRUD de notícias (POST/PUT/DELETE requerem auth)
│       ├── settings/               # Configurações (link do stream)
│       ├── stream/                 # Proxy HLS (contorna mixed content)
│       ├── auth/[...nextauth]/     # NextAuth
│       ├── videos/
│       ├── categories/
│       └── search/
├── components/tvgoias/
│   ├── LivePlayer.tsx              # Player HLS com proxy fallback
│   ├── Hero.tsx                    # Player + cards laterais + destaques
│   ├── Header.tsx, Footer.tsx
│   ├── MaisNoticias.tsx            # Grid + botão "Ver Mais"
│   └── ...
├── lib/
│   ├── db.ts                       # Prisma client
│   ├── auth.ts                     # NextAuth config
│   └── requireAuth.ts              # Helper de auth para APIs
└── middleware.ts                   # Protege /admin

prisma/
├── schema.prisma                   # SQLite (dev) ou Postgres (prod)
└── seed.ts                         # Seed de usuário admin + notícias
```

## 🔐 Segurança

- `/admin` protegido por NextAuth (middleware)
- APIs de POST/PUT/DELETE requerem sessão válida
- Senhas hasheadas com bcrypt (10 rounds)
- `NEXTAUTH_SECRET` deve ser único por ambiente

## 📺 Stream Ao Vivo

O link do stream HLS é configurável via painel admin (tab "Vídeo Ao Vivo").
O player usa HLS.js com proxy interno (`/api/stream`) para contornar:
- Mixed content (HTTPS buscando HTTP)
- Certificados inválidos
- CORS

## 📝 Licença

© 2026 TV Goiás. Criado por [Lipe.Host](https://lipe.host)
