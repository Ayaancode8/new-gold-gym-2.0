# Cloudflare hosting

This repository contains both the public gym website and a Node.js owner admin portal.

## Current compatibility

The complete application is **not ready to deploy directly to Cloudflare Pages or Workers**. The admin portal writes its register, locks, and backups to a local filesystem. Cloudflare Workers does not provide persistent writable disk for this register. Uploading the repository to GitHub does not deploy the website.

Choose the deployment scope before connecting this repository to Cloudflare:

- **Public website only:** create a separate static export build that excludes admin pages and API routes and handles local images without Next.js's server image optimizer. Deploy the resulting `out` directory to Cloudflare Pages. The repository currently has no static export build; selecting the Next.js static preset alone will not work.
- **Public website and admin:** migrate the register to persistent cloud storage, adapt the application for Cloudflare's supported runtime, and verify sessions, password hashing, concurrency, and backups there before deploying.

The existing `npm run build` command builds the complete Node.js application. It is not a Cloudflare Pages static build command.

## Configuration and private data

- `.env.local`, `.data/`, owner credentials, member records, and backups must remain outside Git.
- `.env.example` documents the configuration names without containing real credentials.
- Set `SITE_URL` to the production HTTPS origin before building/deploying. It is used for social metadata and admin origin checks.
- Configure production secrets in the hosting platform rather than committing them.
- Do not use the local owner setup script as a public hosting build step.

## References

- [Cloudflare Pages: static Next.js sites](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Cloudflare Workers: filesystem behavior](https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/)
- [Cloudflare: Next.js hosting options](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
