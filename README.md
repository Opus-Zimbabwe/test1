# Great Couples Reimagined

A new Great Couples International Trust website with immersive photography, bold typography, white and grey sections, a podcast theatre and Facebook community section.

## Development

Requires Node 22.12+ and Bun.

```sh
bun install --frozen-lockfile
bun run dev --host 0.0.0.0 --port 3000
bun run build
```

See [REDESIGN_DEPLOY.md](REDESIGN_DEPLOY.md) for configuration, Vercel deployment and validation limits. Set environment values securely using `.env.example`; do not commit credentials.
