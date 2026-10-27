# syntax=docker/dockerfile:1
ARG BUN_VERSION=1.4.3

# ---------- deps: install once, reused by dev + build ----------
FROM oven/bun:${BUN_VERSION} AS deps
WORKDIR /app
# bun.lock* matches both bun.lockb (binary) and bun.lock (text)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ---------- dev: Vite dev server with hot reload ----------
FROM deps AS dev
COPY . .
EXPOSE 5173
# --host 0.0.0.0 overrides the 127.0.0.1 in vite.config.ts so the port is
# reachable from outside the container (compose still only publishes it on 127.0.0.1)
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]

# ---------- build: production bundle ----------
FROM deps AS build
COPY . .
# .env.production is mounted as a BuildKit secret: Vite picks it up like normal,
# but it never lands in an image layer or the build context.
# required=true makes the build fail loudly instead of shipping undefined VITE_ vars.
RUN --mount=type=secret,id=env_production,target=/app/.env.production,required=true \
    bun run build
# GitHub Pages serves 404.html for unknown paths. Using the SPA shell as 404.html
# lets react-router handle direct loads of /tubify/callback.
RUN cp dist/index.html dist/404.html

# ---------- dist: export only the static files (for pushing to GitHub Pages) ----------
FROM scratch AS dist
COPY --from=build /app/dist /

# ---------- preview: nginx serving the build the way GitHub Pages would ----------
FROM nginx:stable-alpine AS preview
COPY nginx.conf /etc/nginx/conf.d/default.conf
# served under /tubify/ to match the project-site URL on GitHub Pages
COPY --from=build /app/dist /usr/share/nginx/html/tubify
EXPOSE 80