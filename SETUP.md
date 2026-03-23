# WEARVIO Backend + Admin Setup

## Free stack

- Storefront + admin hosting: Vercel free plan
- Database + realtime/auth: Supabase free tier

## 1. Supabase project create karo

1. Supabase me new project banao.
2. SQL Editor me [`supabase/schema.sql`](./supabase/schema.sql) run karo.
3. Uske baad [`supabase/seed.sql`](./supabase/seed.sql) run karo.

## 2. Supabase Auth testing

Testing ke liye:

1. Supabase Dashboard -> Authentication -> Providers -> Email me jao.
2. Agar fast testing chahiye to `Confirm email` off rakho.
3. Storefront signup/signin tab instantly work karega.

## 3. Vercel environment variables

Ye env vars set karo:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WEARVIO_ADMIN_EMAIL`
- `WEARVIO_ADMIN_PASSWORD`
- `WEARVIO_ADMIN_NAME`
- `WEARVIO_ADMIN_SESSION_SECRET`

Reference ke liye [`.env.example`](./.env.example) me sample values diye gaye hain.

Important:

- Real secrets ko repo me commit mat karo.
- Vercel / server env vars hi actual source of truth hone chahiye.
- Agar koi secret GitHub me push ho gaya ho to usko immediately rotate karo.

## 4. Routes

- Storefront: `/`
- Admin panel: `/admin`

`vercel.json` already configured hai so root pe [`wearvio.html`](./wearvio.html) aur admin route pe [`admin.html`](./admin.html) serve hoga.

## 5. Admin credential

- Email: apna khud ka owner email use karo
- Password: strong custom password use karo

Production me deploy karne se pehle password aur session secret rotate karna mandatory samjho.

## 6. Backup

Admin panel ke `Settings` section me `Download backup` button diya gaya hai.

Is export me ye data aata hai:

- categories
- products
- orders
- stock logs
- users
- contact messages
- newsletter subscribers

## 7. Current architecture

- Existing public UI design ko change nahi kiya gaya.
- Storefront live catalog `/api/public/store` se load hota hai.
- Checkout `/api/public/checkout` ke through real order create karta hai.
- Contact/newsletter forms database me save hote hain.
- Admin panel secure cookie-based single credential login use karta hai.
