import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NewsPageClient } from './NewsPageClient'
import { Footer } from '@/components/tvgoias/Footer'

interface RelatedNews {
  id: string
  title: string
  imageUrl: string
  category: string
  date: Date
  slug: string
  summary: string
  hoursAgo: number
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const news = await db.news.findUnique({ where: { slug } })
  if (!news) return { title: 'Notícia não encontrada - TV Goiás' }
  return {
    title: `${news.title} - TV Goiás`,
    description: news.summary,
  }
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params
  const news = await db.news.findUnique({ where: { slug } })

  if (!news) {
    notFound()
  }

  const related = await db.news.findMany({
    where: {
      category: news.category,
      slug: { not: slug },
    },
    take: 3,
    orderBy: { date: 'desc' },
  })

  const relatedTyped: RelatedNews[] = related.map((r) => ({
    id: r.id,
    title: r.title,
    imageUrl: r.imageUrl,
    category: r.category,
    date: r.date,
    slug: r.slug,
    summary: r.summary,
    hoursAgo: r.hoursAgo,
  }))

  // Serializa datas para passar ao client component
  const newsSerialized = {
    ...news,
    date: news.date.toISOString(),
  }
  const relatedSerialized = relatedTyped.map((r) => ({
    ...r,
    date: r.date.toISOString(),
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NewsPageClient news={newsSerialized} related={relatedSerialized} />
      <Footer />
    </div>
  )
}
