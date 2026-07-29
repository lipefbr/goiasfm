import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/requireAuth'

// PUT /api/settings/[id] - Atualiza uma configuração (requer login)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAuth()
  if (response) return response

  try {
    const { id } = await params
    const body = await req.json()
    const { value } = body

    if (typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Campo obrigatório: value (string)' },
        { status: 400 }
      )
    }

    const setting = await db.setting.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    })

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('[PUT /api/settings/[id]] error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configuração' },
      { status: 500 }
    )
  }
}
