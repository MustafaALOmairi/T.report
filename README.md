# Time Report Admin (standalone site)

Separate website for managers: own address, own sign-in, dashboard + user management.
It reads the same Supabase database as the Time Report app (config.js).

## Setup
1. Supabase → SQL Editor → run `admin.sql` (after `users.sql` from the main project).
2. New GitHub repository (e.g. TimeReport_Admin) → upload the files in this folder → Settings → Pages → Deploy from branch `main` / root.
3. Open the new site address and sign in with an account whose role is `admin`.

## Files
index.html, admin.css, admin.js, api.js, config.js  (the site)
admin.sql  (run once in Supabase, not uploaded to the site)
