FROM node:20-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat python3 make g++

# Habilitar corepack para pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Instalar dependencias
RUN pnpm install --frozen-lockfile --prod=false

# Copiar el resto del código
COPY . .

# Build de la aplicación
RUN pnpm build

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://localhost:3000/healthz || exit 1

# Comando de inicio
CMD ["node", "dist/index.js"]
