// GET /api/solar?qyteti=tirane&mode=kwh&kwh=400&lidhja=household&bateri=0&faza=1
// Always 200: invalid input comes back as { ok: false, errors } so the page shows it next to the field.
// The calculator's result as JSON (same object the server page renders from).
import type { APIRoute } from 'astro';
import { readCalcInput, runCalc } from '../../lib/pages-solar';

export const GET: APIRoute = async ({ url }) => {
  const out = await runCalc(readCalcInput(url.searchParams));
  return Response.json(out, { headers: { 'cache-control': 'no-store' } });
};
