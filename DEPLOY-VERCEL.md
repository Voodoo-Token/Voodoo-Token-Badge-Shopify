# Deploy Voodoo Token Badge to Vercel (simple guide)

Follow these steps in order. Each step is one task.

---

## Step 1 — Free database (Neon)

Vercel needs a database. SQLite does not work on Vercel.

1. Go to [https://neon.tech](https://neon.tech) and sign up (free)
2. Create a new project
3. Copy the **connection string** (starts with `postgresql://...`)
4. Keep this tab open — you need it in Step 4

---

## Step 2 — Push latest code to GitHub

On your PC:

```powershell
cd C:\Users\ReMarkt\Desktop\voodoo-widget
git add .
git commit -m "Prepare Vercel deployment"
git push
```

---

## Step 3 — Create Vercel project

1. Go to [https://vercel.com](https://vercel.com) and sign up (use **Continue with GitHub**)
2. Click **Add New → Project**
3. Select your **voodoo-widget** repository
4. Click **Import**
5. **Do not deploy yet** — first add environment variables (Step 4)

---

## Step 4 — Add environment variables in Vercel

In Vercel project → **Settings → Environment Variables**, add:

| Name | Value | Where to get it |
|------|-------|-----------------|
| `SHOPIFY_API_KEY` | Your Client ID | Shopify Partner Dashboard → Apps → your app → Client credentials |
| `SHOPIFY_API_SECRET` | Your Client secret | Same place (click Show) |
| `SHOPIFY_APP_URL` | `https://YOUR-APP.vercel.app` | Use your Vercel URL after first deploy, or guess and fix after |
| `SCOPES` | *(leave empty)* | — |
| `DATABASE_URL` | `postgresql://...` | From Neon (Step 1) |

Click **Save**.

---

## Step 5 — Deploy on Vercel

1. Go to **Deployments** → **Redeploy** (or first deploy if you continued)
2. Wait until status is **Ready**
3. Copy your live URL, e.g. `https://voodoo-widget-abc123.vercel.app`
4. Go back to **Settings → Environment Variables**
5. Update `SHOPIFY_APP_URL` to your real Vercel URL (no trailing slash)
6. **Redeploy** once more

---

## Step 6 — Connect Shopify to Vercel

On your PC:

1. Open `shopify.app.toml`
2. Change:

```toml
application_url = "https://YOUR-APP.vercel.app"

[auth]
redirect_urls = [ "https://YOUR-APP.vercel.app/auth/callback" ]
```

3. Save, then run:

```powershell
cd C:\Users\ReMarkt\Desktop\voodoo-widget
shopify app deploy
```

4. In **Shopify Partner Dashboard** → your app → set **App URL** to the same Vercel URL

---

## Step 7 — Install on a test store

1. Partner Dashboard → your app → **Test your app** → Install on development store
2. Open the app → **Badge settings** → **Save**
3. **Online Store → Themes → Customize → App embeds**
4. Enable **Voodoo Token Badge** → **Save**
5. Open your store — badge should appear

---

## If something fails

| Problem | Fix |
|---------|-----|
| Build fails on Vercel | Check **Deployments → Logs**; usually missing `DATABASE_URL` |
| App won't open in Shopify | `SHOPIFY_APP_URL` must match Vercel URL exactly |
| Badge not visible | Enable **App embeds** in theme editor |
| Database error | Check Neon connection string and redeploy |

---

## After it works

- Push code changes to GitHub → Vercel auto-deploys
- Run `shopify app deploy` when you change the theme extension