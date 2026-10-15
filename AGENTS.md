<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Rule for implementation
- Read docs/*
- Never commit .env, and creditials key
- Always make unit test for new API (good rute & bad rute)
- Use shadcn component for UI, only if the component is avaliable, otherwise make your own component using tailwind css.
- Don't ask me if you want to downlod shadcn component, just do it. I have given you the "okay" permission for it, but make sure to check the package is safe and trusted. Don't install any other deps that not required for the project.
- Don't make component inside one file, make independent component, and if the component already in shadcn, use it. but if the component is not in shadcn, make your own component.

<!-- END:nextjs-agent-rules -->
