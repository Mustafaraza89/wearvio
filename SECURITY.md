# Security Note

If a real `.env` or secret value was pushed to GitHub, treat it as compromised.

Rotate these first:

- `SUPABASE_SERVICE_ROLE_KEY`
- `WEARVIO_ADMIN_PASSWORD`
- `WEARVIO_ADMIN_SESSION_SECRET`

Recommended clean state:

1. Keep only [`.env.example`](./.env.example) in git.
2. Store real values only in Vercel project environment variables.
3. Remove tracked secret files from git history later if the repository is public or shared.

This repository is configured so `.env`, `.env.local`, and other `.env.*` files are ignored by git, while [`.env.example`](./.env.example) remains safe to track.
