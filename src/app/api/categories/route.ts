import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/categories - Lista todas as categorias
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('[GET /api/categories] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}
