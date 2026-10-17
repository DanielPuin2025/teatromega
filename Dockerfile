FROM node:20-alpine
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://localhost:3000/healthz || exit 1
CMD ["node", "dist/index.js"]
