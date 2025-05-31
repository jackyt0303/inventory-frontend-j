import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - this will automatically refresh the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

   // Define protected routes
   const protectedRoutes = ['/dashboard', '/inventory', '/main-page', '/reset-password']
   const authRoutes = ['/login', '/signup', '/auth']
   
   const isProtectedRoute = protectedRoutes.some(route => 
     request.nextUrl.pathname.startsWith(route)
   )
   const isAuthRoute = authRoutes.some(route => 
     request.nextUrl.pathname.startsWith(route)
   )
 
   // NOW WE USE THE SESSION DATA:
   
   // If user is not logged in and trying to access protected route
   if (isProtectedRoute && !session) {
     const loginUrl = new URL('/login', request.url)
     // Optional: Add redirect parameter to return after login
     loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
     return NextResponse.redirect(loginUrl)
   }
 
   // If user is logged in and trying to access auth pages, redirect to dashboard
   if (isAuthRoute && session) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
   }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}