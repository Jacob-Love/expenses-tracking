// Netlify Function serving /api/ai/* so the Gemini key stays server-side.
// Set GEMINI_API_KEY (and optionally GEMINI_MODEL) in Netlify → Site
// configuration → Environment variables, scoped to Functions.

import { handleAiWeb } from '../../server/handler.ts';

export default (req: Request) => handleAiWeb(req);

export const config = { path: '/api/ai/*' };
