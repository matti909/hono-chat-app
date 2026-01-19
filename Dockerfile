FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source and generate prisma client
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
