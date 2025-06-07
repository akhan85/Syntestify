import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  // Only protect /dashboard route
  if (!req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Optionally, you could verify the token with Supabase here for extra security
  // For now, presence of token is enough for basic protection
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
