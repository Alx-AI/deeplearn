export { auth as proxy } from '@/auth';

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - /signin
     *  - /api/auth (NextAuth routes)
     *  - /api/health
     *  - /_next (Next.js internals)
     *  - /favicon.ico, /robots.txt, static assets
     */
    '/((?!signin|signup|api/auth|api/health|_next|favicon\\.ico|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
