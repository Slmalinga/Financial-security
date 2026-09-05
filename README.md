<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1bB9Oj0WJGnnDij4ISLDN8YHEIAaQ2qug

## AI insights & the API key

The Gemini API key is **never bundled into the client**. It is used only by the
serverless function at [`api/advice.ts`](api/advice.ts), which reads it from the
`GEMINI_API_KEY` environment variable. The browser calls `/api/advice`; the key
stays server-side.

### Deploying on Vercel

1. Import the repo into Vercel.
2. In **Project Settings → Environment Variables**, add `GEMINI_API_KEY` with
   your Gemini API key. Do not prefix it with `VITE_` (that would expose it to
   the client).
3. Deploy. Vercel serves the static Vite build and runs `api/advice.ts` as a
   serverless function automatically.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app with the Vercel CLI so the `/api/advice` function is available:
   `vercel dev`

   > `npm run dev` (plain Vite) serves the UI but not the `/api` function, so
   > AI insights will report the advisor as offline. Use `vercel dev` for the
   > full experience.
