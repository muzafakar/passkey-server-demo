# Passkey Demo Project (Next.js + SimpleWebAuthn)

This is a demo project implementing passkey (WebAuthn) registration and authentication using Next.js (TypeScript) and [SimpleWebAuthn](https://simplewebauthn.dev/). It demonstrates a stateless, file-based credential store and is suitable for web and mobile integration demos.

## Features
- Passkey registration and authentication (WebAuthn)
- Stateless API routes (no session/cookie dependency)
- File-based credential storage (`credentials.json`)
- Multi-user support (credentials indexed by username)
- Simple challenge generation for demo purposes
- Ready for integration with Android or other clients

## Project Structure
- `app/api/webauthn/register/route.ts` — Registration option generation
- `app/api/webauthn/register/verify/route.ts` — Registration verification and credential storage
- `app/api/webauthn/authenticate/route.ts` — Authentication option generation
- `app/api/webauthn/authenticate/verify/route.ts` — Authentication verification
- `app/api/webauthn/credentialStore.ts` — File-based credential manager
- `app/api/webauthn/challenge.ts` — Challenge generator utility

## Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **API Endpoints:**
   - `POST /api/webauthn/register` — Get registration options
   - `POST /api/webauthn/register/verify` — Verify registration and store credential
   - `POST /api/webauthn/authenticate` — Get authentication options
   - `POST /api/webauthn/authenticate/verify` — Verify authentication

## Notes
- This demo uses a simple file-based credential store (`credentials.json`). Do **not** use this approach in production.
- Challenges are generated per-username and are not cryptographically secure. For real deployments, use secure random values and proper session management.
- The project is designed for easy integration with mobile apps and web clients.

## References
- [SimpleWebAuthn Documentation](https://simplewebauthn.dev/docs/)
- [WebAuthn Guide (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

---

**Demo only. Not for production use.**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
