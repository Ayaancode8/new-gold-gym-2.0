# Cloudflare Pages deployment

The public website and admin demo are a static Next.js export. Admin records live in each visitor's browser; the site needs no database or application server.

Connect this GitHub repository to a Cloudflare **Pages** project with Git integration:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None (enter the build settings below) |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `out` |

Use a Node.js version supported by the project (20.9 or newer). Optionally set `SITE_URL` to the final `https://…pages.dev` or custom-domain origin, then rebuild. No deploy command or Worker bindings are needed for Pages.

After deployment, open `/` and `/admin/`. The introduction is at `/admin/login/`. Admin links use hash navigation, including newly created records, so refreshing a detail page works without server rewrites.

## Demo data

There is no admin password. Each browser has its own fictional register in `localStorage`; edits survive refresh and are not shared across devices or origins. Use **Demo → Reset demo data** to start again. A preview domain and a custom domain have separate browser storage. Browser storage must be enabled. Reminders remain simulations.

Do not configure `ADMIN_DATA_PATH`, owner credentials, or server session secrets. Existing local `.data/` files and `.env.local` are excluded from Git and from the exported site. The static application has no `/api/admin` endpoints.

## Preview before deployment

```sh
npm ci
npm run build
npm start
```

`npm start` serves the actual `out/` directory. Cloudflare serves those same files directly. The public website uses local WebP assets with image optimization disabled because there is no image-processing server.

[Cloudflare's static Next.js deployment guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
