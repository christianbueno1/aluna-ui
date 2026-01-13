# ============================================
# Build Stage
# ============================================
FROM docker.io/library/node:22.21.1-alpine3.23 AS builder

# Instalar pnpm usando corepack (ya viene con Node.js)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configurar PATH para pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# Build de producción
RUN pnpm run build

# ============================================
# Production Stage
# ============================================
FROM docker.io/library/caddy:2.10.2-alpine

# Copiar archivos compilados desde build stage
COPY --from=builder /app/dist /usr/share/caddy

# Copiar Caddyfile de configuración
COPY Caddyfile /etc/caddy/Caddyfile

# Exponer puerto 8080
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Caddy se ejecuta automáticamente con la imagen base