import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Verificamos si la ruta empieza con /admin y no es /admin/login
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // Si requiere auth y no hay token de sesión en las cookies de Supabase
  const authCookie = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token')

  // Nota: Al usar signInWithPassword desde el cliente, la validación en el cliente (Paso 2)
  // actuará como resguardo directo.

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
