# GeFi.io

This repository hosts:

1. **`platform/`** — **canonical product** (Next.js + Hono API + Python quant/FL + Rust SecAgg/ZK). See [`platform/README.md`](platform/README.md).
2. **Root Jekyll site** — **deprecated** for new product work (Cloudflare Pages marketing legacy). See [`platform/JEKYLL_DEPRECATED.md`](platform/JEKYLL_DEPRECATED.md).
3. **`infrastructure/cloudflare/`** — existing Workers (marketplace, compliance, federation stubs) kept as reference while the platform control plane evolves.
4. **`legacy/`** — archived React/Express prototype.

## Start here

```bash
cd platform
pnpm install
pnpm --filter @gefi/api dev    # :8787
pnpm --filter @gefi/web dev    # :3000
```

Layered privacy docs: `platform/docs/threat-model.md`, `protocol.md`, `privacy-accounting.md`.
