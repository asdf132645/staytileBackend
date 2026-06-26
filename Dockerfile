# ── Stage 1: 빌드 ────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 먼저 복사 (레이어 캐시 활용)
COPY package*.json ./
RUN npm ci

# 소스 전체 복사 후 빌드
COPY . .
RUN npm run build

# ── Stage 2: 프로덕션 런타임 ─────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 빌드 결과물만 복사
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
