FROM oven/bun:1 AS deps
WORKDIR /app
ARG NPM_AUTH_TOKEN
ENV NPM_AUTH_TOKEN=$NPM_AUTH_TOKEN
COPY package.json bun.lock .npmrc ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3006
CMD ["sh", "-c", "bunx drizzle-kit migrate && bun run src/index.ts"]
