FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:22-alpine AS installer
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm ci --omit=dev
RUN npx prisma generate

FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Don't run production as root for security
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs

# Copy app with correct ownership
COPY --from=installer --chown=expressjs:expressjs /app .

USER expressjs

EXPOSE 3000

CMD ["npm", "run", "start"]