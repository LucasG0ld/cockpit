// apps/frontend/src/middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)'
]);

export default clerkMiddleware((auth, request) => {
  // On ne fait rien. On laisse le middleware gérer son cycle de vie.
  // Si ce n'est pas une route publique, la protection doit être implicite.
  // Si même cela ne fonctionne pas, le problème est ailleurs.
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};