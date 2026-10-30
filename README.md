# New Gold Gym 2.0

The public website and owner admin portal implemented from the Penpot Mobile and Desktop prototypes.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For the production build:

```sh
npm run build
npm start
```

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Playwright uses system Chrome when available at `/opt/google/chrome/chrome`. Otherwise run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Build before running browser tests. The suite starts an isolated production server on port 3010 with a temporary register and test-only credentials. Public WhatsApp navigation is intercepted; admin reminders are simulated. No messages are sent.

Run just the admin checks with `npm run test:admin`, or the storage/business-rule tests without a server with `npx playwright test --config=playwright.unit.config.ts`.

## Owner admin

Configure local access once before starting the server:

```sh
npm run admin:setup
npm run dev
```

Open `/admin`. The generated username and password are in `.data/owner-access.txt`. Setup preserves an existing `.env.local`; repeated setup preserves the owner configuration. Restart an already-running server after configuration changes. The application reads a salted scrypt password hash and a session signing secret from environment configuration; it never sends these to the browser. Sessions last eight hours. Changing the password hash or signing secret invalidates existing sessions. Five failed logins pause further attempts for 15 minutes in the current server process.

The portal includes Overview, Attendance, Members, Payments and Analytics, plus member profiles, add/edit, archive/restore, inactive lists, attendance correction/removal/Undo, fee-period receipts and voids, and reminder audience/review/results/retry. The layout is mobile-first, with a desktop sidebar and paired panels from 1024px.

### Temporary register

- The first authenticated visit creates `.data/admin.json` with 126 fictional members and synthetic attendance/receipts, anchored to the creation date in Asia/Karachi. On October 30, 2026, its initial summaries are 43 present, 83 not marked, 91 paid and 35 pending, including 12 overdue.
- Values are calculated from records. Refreshing or restarting the server retains changes. `ADMIN_DATA_PATH` can point to another writable JSON file. All server routes use the Node.js runtime and one local filesystem; use one server instance with persistent storage.
- Writes use a filesystem lock and atomic replacement. `.data/admin.json.backup` holds the last valid version before a change. Revision checks protect concurrent edits, and submission IDs prevent replayed receipts or duplicated member creation.
- To restore, stop the server, keep a copy of the damaged file, copy the `.backup` file over the primary file, and restart. Damaged or unsupported data is reported rather than replaced. To start a fresh sample register, stop the server and move **both** the primary JSON and its backup aside before restarting. These files contain the register; keep your copies private.
- Fees are stored in integer paisa. Joining days anchor renewals; short months clamp without changing the original day. Each charge retains its amount and period. Receipts establish payment, voids retain history, and attendance has no effect on fee status. Archive pauses future fees and reminders while retaining historical debt.
- Dates and times follow Asia/Karachi. Future fee changes are previewed and leave posted periods and receipts intact. Restoration requires reviewing the next fee date.

### Reminder simulation

All reminder actions are explicitly simulated. The portal reviews 3-day, 7-day and overdue audiences, permission/phone exclusions, personalised messages, results and failed-only retries. Queued eligibility is rechecked one recipient at a time; payment while queued causes a skip. Overlapping audiences cannot repeat the same member/fee reminder that day. Queue progress is saved, and reopening a results page resumes processing. Pause is available while the page is open.

For a reproducible failure example, numeric member IDs divisible by 17 fail on their first simulation attempt and succeed on retry. A simulated “Sent” result does not mean delivered. No WhatsApp API connection, credential or template is configured.

### Temporary Cloudflare preview

With the production app running on port 3030, `cloudflared tunnel --url http://localhost:3030` creates a temporary HTTPS address. Open `/admin` on that address and use the same owner credentials. The computer, server and tunnel must remain running; JSON data stays on this computer. HTTPS proxy headers are supported. If `SITE_URL` is configured, set it to the public tunnel origin and restart the server before logging in.

Direct Cloudflare Workers hosting requires replacing the local JSON store with persistent cloud storage; its temporary filesystem cannot retain this register between requests.

### Internal API

- `POST /api/admin/login` and `/api/admin/logout` establish/clear the HttpOnly owner cookie.
- `GET /api/admin/state` returns the current records, revision and local date, with private/no-store caching.
- `POST /api/admin/actions` accepts `{ revision, submissionId, command }`. Typed commands cover member, attendance, receipt and reminder changes; runtime validation is enforced on the server. Errors include a readable `error` and, where relevant, a `field`. Conflicts return 409 and prompt review of the latest records without losing form input.

Every data endpoint requires the owner session; POST endpoints also validate the request origin. There are no public registration, password-reset, remote database or messaging endpoints.

## Content and behavior

- Shared memberships, reviews, photos and contact details live in `src/data/gym.ts`.
- Enquiries use **+92 333 1267175** and prepare a WhatsApp draft containing the selected membership and admission fee. Sending remains the visitor's action inside WhatsApp.
- Address and opening hours retain the approved placeholder copy.
- Below 1024px, the site uses Discover, Gym, Plans and Reviews destinations with persistent bottom navigation. Larger screens use the approved desktop homepage. Public hashes preserve destination selection across navigation and resizing.
- The original files in `assets/` and `logo/` remain intact. WebP derivatives and native Penpot navigation SVG exports are served locally. Teko, Barlow Condensed and Inter Tight are bundled and self-hosted with `next/font/local`.
- The public website needs no external backend service or account. Admin requires the local owner configuration above. Before publishing, set `SITE_URL` to the real origin; admin POST origins must match it when configured. There is no deployment configured.

The source design and historical exports are documented in `PRODUCT.md`, `DESIGN.md` and `design-previews/`.
