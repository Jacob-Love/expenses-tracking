import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleAi } from './server/handler.ts';

export default defineConfig(({ mode }) => {
  // Server-only: GEMINI_* is read here and never exposed to the client bundle.
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), 'GEMINI_') };
  return {
    plugins: [
      react(),
      {
        name: 'ledger-ai-proxy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => { handleAi(req, res, env).then((done) => { if (!done) next(); }, next); });
        },
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => { handleAi(req, res, env).then((done) => { if (!done) next(); }, next); });
        },
      },
    ],
  };
});
