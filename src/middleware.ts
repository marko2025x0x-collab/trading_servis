import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protect /pro-dashboard route
  if (pathname.startsWith('/pro-dashboard')) {
    // Check if demo query param is set, or if auth/subscription cookie is active
    const isDemoMode = searchParams.get('demo') === 'true';
    const authSessionCookie = request.cookies.get('sb-access-token')?.value || request.cookies.get('trading_pro_session')?.value;
    const userRole = request.cookies.get('user_subscription_status')?.value;

    // Allow access if demo mode or active pro session exists
    if (!isDemoMode && !authSessionCookie && userRole !== 'pro') {
      const paywallUrl = new URL('/paywall', request.url);
      paywallUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(paywallUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pro-dashboard/:path*'],
};
