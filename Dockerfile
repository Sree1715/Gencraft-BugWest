# ─── Stage 1: Build Vite frontend ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /build

# Install deps first (layer-cached unless package.json changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
# Result: /build/dist/

# ─── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy server source
COPY server/ ./server/

# Copy built frontend from stage 1
COPY --from=builder /build/dist ./dist

# Data directory — SQLite database lives here (mounted as a volume)
RUN mkdir -p /data && chown node:node /data

# Run as non-root
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1

CMD ["node", "server/index.cjs"]
