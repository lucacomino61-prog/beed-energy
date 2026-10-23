// POST /admin/logout: ends the session (CSRF-checked when a session exists) and returns to the sign-in page.
import type { APIRoute } from 'astro';
import { csrfOk, endSession } from '../../lib/auth';
import { audit } from '../../lib/db';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const user = locals.user;
  if (user) {
    const form = await request.formData().catch(() => new FormData());
    if (!csrfOk(user, form)) return new Response('Forbidden', { status: 403 });
    audit(user.id, 'auth.logout');
  }
  endSession(cookies);
  return redirect('/admin/login?ok=signedOut', 303);
};

export const GET: APIRoute = ({ redirect }) => redirect('/admin', 303);
