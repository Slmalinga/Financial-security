import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    // The Gemini API key is intentionally NOT injected into the client bundle.
    // It is held server-side as GEMINI_API_KEY in Vercel and used only by the
    // serverless function at /api/advice.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
