FROM oven/bun:1.2-debian

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install production dependencies only
RUN bun install --production

# Copy source
COPY . .

# Generate Prisma client
RUN bunx prisma generate --schema=src/prisma/schema.prisma


ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]