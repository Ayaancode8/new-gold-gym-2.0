# New Gold Gym 2.0

A demo gym website and interactive admin portal, built from the approved Penpot mobile and desktop designs. The complete site exports to static files for free Cloudflare Pages hosting.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). To preview the exported website:

```sh
npm run build
npm start
```

`npm start` serves only the generated `out/` files. No Next.js application server, database, owner password or API is required.

## Admin demo

Open `/admin/` directly, or `/admin/login/` for the demo introduction. There is no password or authentication gate.

- Each browser starts with 126 fictional members and synthetic attendance and receipts, anchored to the current date in Asia/Karachi.
- Members, attendance, fee periods, payment corrections, analytics and simulated reminders use the existing business rules. Figures are calculated from records.
- Changes are saved in this site's `localStorage`, survive refresh, and stay within the current browser profile. Other browsers, devices, and site origins have separate demo registers. Clearing site data removes the saved demo.
- Choose **Demo → Reset demo data**, then confirm **Reset demo**, to replace the browser's register with fresh sample data. Cancellation keeps existing records. No other site storage is cleared.
- Browser storage must be enabled. Full, unavailable or damaged storage produces a readable recovery message. Failed saves preserve form input. Damaged demo data can be replaced through the reset control.
- Admin navigation uses URLs such as `/admin/#/members` so new member IDs, payment details, filters, refresh and browser history work on static hosting.
- Web Locks serialize writes between tabs where supported. Revision checks reject stale edits; submission IDs prevent repeated saves. Browsers without Web Locks have a synchronous local-storage fallback, which does not guarantee simultaneous multi-tab writes.
- This is a public demo with fictional records, not a private register for real gym/customer information.

All admin reminders are simulated. No WhatsApp API, account or messaging credential is configured, and no reminder messages are sent.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:unit
npm run test:e2e
```

Build before the browser suite. Tests serve `out/` on port 3010, exercising the same static files used by Cloudflare. Each browser context gets its own demo storage. Playwright uses system Chrome at `/opt/google/chrome/chrome` when available; otherwise run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Next.js uses the TypeScript compiler API during builds (`experimental.useTypeScriptCli: false`), retaining type checks while avoiding the project's CLI configuration-output failure.

## Cloudflare Pages

See [DEPLOYMENT.md](DEPLOYMENT.md). Use build command **`npm run build`**, output directory **`out`**, and the repository's **`main`** branch. No database, Worker, API tokens or admin secrets are needed by the application.

## Public content

Shared memberships, reviews, photos and contact details live in `src/data/gym.ts`. Enquiries prepare a WhatsApp draft for **+92 333 1267175**; sending remains the visitor's action inside WhatsApp. Address and opening hours retain the approved placeholder copy.

The original `assets/` and `logo/` files remain intact. Local WebP images and bundled fonts keep the exported site self-contained. The public website retains Discover, Gym, Plans and Reviews on mobile and its desktop homepage from 1024px.

Set optional `SITE_URL` to the final HTTPS origin before building for absolute social image URLs. `.env.local`, `.data/`, local credentials and generated files remain excluded from Git. Existing local server records are never imported into the browser demo.

The source design and historical exports are documented in `PRODUCT.md`, `DESIGN.md` and `design-previews/`.
