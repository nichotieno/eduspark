
import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export const config = {
  matcher: ['/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // If no session, redirect to login page
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname); // Optionally pass next URL
    return NextResponse.redirect(loginUrl);
  }
  
  // Role-based authorization
  const { role } = session;
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/dashboard/teacher') && role !== 'teacher') {
       return NextResponse.redirect(new URL('/dashboard/student', request.url));
  }
  
  if (pathname.startsWith('/dashboard/student') && role !== 'student') {
        return NextResponse.redirect(new URL('/dashboard/teacher', request.url));
  }
  
  return NextResponse.next();
}
