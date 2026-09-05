# Publishing FinSight to the Google Play Store

FinSight is a web app. To put it on Play we wrap the live (Vercel-hosted) PWA
in a **Trusted Web Activity (TWA)** using **Bubblewrap**. This document lists
every step and every policy item Google requires.

---

## 0. Prerequisites (already done in this repo)

- ✅ Web App Manifest — `public/manifest.webmanifest`
- ✅ Service worker — `public/sw.js` (registered in `index.tsx`)
- ✅ Maskable + standard icons — `public/icons/`
- ✅ Digital Asset Links stub — `public/.well-known/assetlinks.json`
- ✅ Privacy Policy page — `public/privacy.html` (served at `/privacy.html`)

> After deploying, verify these are live:
> `https://<your-domain>/manifest.webmanifest`,
> `https://<your-domain>/privacy.html`,
> `https://<your-domain>/.well-known/assetlinks.json`

---

## 1. Build the Android app with Bubblewrap

```bash
npm install -g @bubblewrap/cli

# Point it at your deployed manifest
bubblewrap init --manifest https://<your-domain>/manifest.webmanifest

# Answer the prompts. Key answers:
#   Application ID  -> a unique reverse-domain id, e.g. app.finsight.twa
#   Signing key     -> let Bubblewrap create one, and KEEP THE KEYSTORE SAFE

bubblewrap build     # produces app-release-bundle.aab (upload this) + APK
```

## 2. Wire up Digital Asset Links (removes the browser URL bar)

1. Get your app's SHA-256 signing fingerprint:
   ```bash
   bubblewrap fingerprint   # or: keytool -list -v -keystore <your.keystore>
   ```
   If you use **Play App Signing** (recommended), also copy the SHA-256 from
   Play Console → your app → *Setup → App integrity → App signing key
   certificate*.
2. Put the values into `public/.well-known/assetlinks.json`:
   - `package_name` = your Application ID
   - `sha256_cert_fingerprints` = the fingerprint(s) — include **both** the
     upload key and the Play App Signing key.
3. Redeploy so `https://<your-domain>/.well-known/assetlinks.json` is live.

---

## 3. Play Console policy checklist (what you were "missing")

### 3.1 Privacy Policy — REQUIRED
- Store listing → add the URL `https://<your-domain>/privacy.html`.
- Edit `public/privacy.html` and replace `REPLACE_WITH_YOUR_CONTACT_EMAIL`
  with a real contact email.

### 3.2 Data safety form — REQUIRED (this is the important one for a finance app)
Declare accurately. For FinSight:

| Question | Answer |
| --- | --- |
| Does your app collect or share user data? | **Yes** (because of the AI feature) |
| Data type: **Financial info → Purchase/transaction history** | Collected? *No server storage* — but it **is shared** with Google Gemini when the AI feature is used. Mark **Shared**. |
| Is data processed ephemerally? | The AI request data is not stored by us; mark ephemeral where applicable. |
| Is data encrypted in transit? | **Yes** (HTTPS to `/api/advice`). |
| Can users request deletion? | **Yes** — in-app Purge + local-only storage. |
| Advertising / analytics data | **None collected.** |
| Location, contacts, photos, personal identifiers | **None.** |

> Key honesty point: even though records live locally, the AI insights call
> sends transaction descriptions + amounts to a third party (Google). That
> **must** be disclosed as data sharing. If you would rather declare "no data
> shared", you must remove/disable the AI feature.

### 3.3 Financial features declaration
- In *App content*, if asked whether the app provides financial features,
  FinSight is a **personal budgeting / money-management tool** — it does **not**
  offer loans, payments, investments, or crypto trading. Complete the
  declaration accordingly; the restricted lending/crypto-exchange rules do not
  apply.

### 3.4 Content rating questionnaire — REQUIRED
- Complete it; FinSight has no objectionable content → expect "Everyone".

### 3.5 Target audience & children
- Target audience: adults (18+ is simplest for a finance app). Not designed for
  children.

### 3.6 Technical requirements
- **Target API level**: Bubblewrap targets a recent level automatically; make
  sure it meets Google's current minimum for new apps.
- **App access**: no login required — tell reviewers "no credentials needed".
- Upload the **`.aab`** (Android App Bundle), not the APK.

---

## 4. Store listing assets you'll still need to create
- App icon (512×512) — you can reuse `public/icons/icon-512.png`.
- Feature graphic (1024×500).
- At least 2 phone screenshots.
- Short description (≤80 chars) and full description.

---

## 5. Housekeeping before launch
- Replace the contact email in `public/privacy.html`.
- Replace the two `REPLACE_WITH_...` placeholders in `assetlinks.json`.
- Confirm `GEMINI_API_KEY` is set in Vercel (Project Settings → Environment
  Variables, **no** `VITE_` prefix) so AI insights work in production.
