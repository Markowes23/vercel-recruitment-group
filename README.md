# Vercel Recruitment BV Static Website

Production-ready static site files live in `outputs/`.

## Run locally

```powershell
npm install
npm run serve
```

The server will expose `outputs/` as the web root.

## Deploy

Upload the full contents of `outputs/` to any static host, or configure the host's publish directory to `outputs`.

Important deployment notes:

- Keep `index.html` at the web root.
- Preserve the `assets/` and `jobs/` folders.
- Serve with clean HTTPS in production.
- The registration page uses Stripe's hosted Buy Button script and requires outbound access to `https://js.stripe.com`.

## Quality Check

```powershell
npm run check:links
```

This validates local `href` and `src` references across the static export.
