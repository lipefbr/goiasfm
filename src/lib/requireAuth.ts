import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

/**
 * Verifica se o usuário está autenticado.
 * Retorna a session ou uma resposta 401.
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { error: 'Não autorizado. Faça login.' },
        { status: 401 }
      ),
    }
  }
  return { session, response: null }
}
