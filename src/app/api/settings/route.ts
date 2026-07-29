import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/settings - Lista todas as configurações
export async function GET() {
  try {
    const settings = await db.setting.findMany()
    const obj: Record<string, string> = {}
    for (const s of settings) obj[s.id] = s.value
    return NextResponse.json({ settings: obj })
  } catch (error) {
    console.error('[GET /api/settings] error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}
