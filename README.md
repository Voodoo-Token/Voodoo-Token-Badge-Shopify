# Voodoo Token Badge — Shopify

Show a **"Voodoo Token — Accepted Here"** badge on your Shopify storefront so visitors know you accept **Voodoo Token (VDO)**.

[![License: GPL v2+](https://img.shields.io/badge/License-GPLv2%2B-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![Shopify](https://img.shields.io/badge/Shopify-Online%20Store%202.0-7AB55C)](https://www.shopify.com/)
[![Node](https://img.shields.io/badge/Node-20%2B-339933)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/Voodoo-Token/voodoo-token-badge-shopify/releases)

**Repository:** [github.com/Voodoo-Token/voodoo-token-badge-shopify](https://github.com/Voodoo-Token/voodoo-token-badge-shopify)

---

## Overview

This Shopify app adds a fixed-corner acceptance badge for stores and communities that take **VDO**. It works with **Online Store 2.0** themes via an **app embed** and includes an embedded admin app for configuration.

Once enabled, the badge appears on your storefront with the official Voodoo Token logo and a consistent **"VOODOO TOKEN / ACCEPTED HERE"** label. You control size, position, font, and colors from the app — optional shadow and hover effects are available but **off by default**.

Pairs well with the [Voodoo Token Payment Gateway](https://github.com/Voodoo-Token/voodoo-token-payment-gateway) for WooCommerce, or use this badge on Shopify while you accept VDO through your own checkout flow.

**Official site:** [voodootoken.com](https://voodootoken.com)

---

## Features

- Fixed **corner badge** with official Voodoo Token branding
- **Size presets** — Small (75%), Medium, Large (125%), Extra Large (150%)
- **Position control** — all four screen corners
- **Edge spacing** — horizontal and vertical offset (0–200 px)
- **Font picker** — system fonts with Shopify CDN–safe fallbacks
- **Color controls** — background and text color
- **Optional drop shadow** (off by default)
- **Optional hover zoom** (off by default)
- **Mobile toggle** — show or hide on small screens
- **No page scroll on click** — badge is not a link
- Embedded **Badge settings** page in Shopify admin

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Shopify | Online Store 2.0 theme |
| Node.js | 20+ |
| Shopify CLI | Latest |
| Shopify Partner account | For development & deployment |

No crypto wallet or API keys required for the badge itself.

### Fixed badge label

| Line | Text |
|------|------|
| Title | `VOODOO TOKEN` |
| Subtitle | `ACCEPTED HERE` |

The label text is not editable from the settings screen.

---

## Installation (merchants)

> Merchants install via the **Shopify App Store** or an **install link** from the app developer — not by downloading this GitHub repo.

1. Install **Voodoo Token Badge** from the Shopify App Store (or your install link)
2. Open the app → **Badge settings** → configure appearance → **Save**
3. Go to **Online Store → Themes → Customize**
4. Open **App embeds** and enable **Voodoo Token Badge**
5. Save the theme

The badge will appear on your storefront on the next page load.

---

## Development

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/getting-started)
- [Shopify Partner account](https://partners.shopify.com)
- Node.js 20+

### Local setup

```bash
git clone https://github.com/Voodoo-Token/voodoo-token-badge-shopify.git
cd voodoo-token-badge-shopify
npm install
shopify app dev
```

Press **P** in the terminal to open the app URL and install on your development store.

### Project structure

```
voodoo-token-badge-shopify/
├── app/
│   ├── lib/badge-settings.server.js   # Settings load/save (shop metafields)
│   └── routes/app._index.jsx          # Embedded admin settings UI
├── extensions/voodoo-token-badge/
│   ├── blocks/badge.liquid            # App embed (target: body)
│   ├── snippets/voodoo-token-badge.liquid
│   ├── assets/
│   │   ├── voodoo-token-badge.css
│   │   └── voodoo-token-logo.png
│   └── locales/
├── prisma/                            # Session storage (dev: SQLite)
├── shopify.app.toml                   # App configuration
└── package.json
```

---

## How it works

```
Install app → Configure in Badge settings → Save
    ↓
Enable App embed in Theme Editor
    ↓
Visitor sees "VOODOO TOKEN / ACCEPTED HERE"
    ↓
Changes apply on the next page load
```

### Badge defaults

- Badge is a **static element** — not a link
- Clicking it does **not** scroll or navigate the page
- **Drop shadow** and **hover zoom** are disabled on a fresh install
- Label text is always **VOODOO TOKEN / ACCEPTED HERE**
- Bottom-right corner, medium size

---

## Deployment

This app has two parts:

| Part | What it is | How to deploy |
|------|------------|---------------|
| **Theme extension** | Storefront badge | `shopify app deploy` |
| **Admin app** | Settings UI in Shopify admin | Host on Vercel, Railway, Fly.io, etc. |

### Before pushing to GitHub

Ensure `.gitignore` excludes:

- `node_modules/`
- `.env`
- `*.sqlite`

Do **not** commit secrets or local database files.

### Hosting the admin app

1. Deploy the `app/` backend to your host (e.g. Vercel)
2. Set environment variables: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `SHOPIFY_APP_URL`
3. Use **PostgreSQL** for production (SQLite is for local dev only)
4. Update `application_url` in `shopify.app.toml`
5. Run `shopify app deploy`

---

## FAQ

**Where do merchants configure the badge?**  
In the embedded app under **Badge settings** in Shopify admin.

**Can merchants change the badge text?**  
No. The label is fixed so branding stays consistent across all Voodoo Token properties.

**Does the badge link anywhere?**  
No. It will not scroll the page or open a URL.

**Are shadow and hover effects on by default?**  
No. Both are optional and disabled on install.

**Does this app process VDO payments?**  
No — it only displays the acceptance badge. For WooCommerce VDO checkout, use the [Payment Gateway plugin](https://github.com/Voodoo-Token/voodoo-token-payment-gateway).

**WordPress version available?**  
Yes — see [voodoo-token-badge](https://github.com/Voodoo-Token/voodoo-token-badge) for the WordPress plugin.

---

## Related projects

| Platform | Repository |
|----------|------------|
| WordPress | [voodoo-token-badge](https://github.com/Voodoo-Token/voodoo-token-badge) |
| WooCommerce payments | [voodoo-token-payment-gateway](https://github.com/Voodoo-Token/voodoo-token-payment-gateway) |
| Shopify (this app) | [voodoo-token-badge-shopify](https://github.com/Voodoo-Token/voodoo-token-badge-shopify) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-change`
3. Commit your changes and open a pull request

Please test on a Shopify development store before submitting.

---

## License

**GPLv2 or later** — see [GNU GPL v2](https://www.gnu.org/licenses/gpl-2.0.html).

---

## Support

- Website: [voodootoken.com](https://voodootoken.com)
- Issues: [GitHub Issues](https://github.com/Voodoo-Token/voodoo-token-badge-shopify/issues)

---

Built for the [Voodoo Token](https://voodootoken.com) community on PulseChain.