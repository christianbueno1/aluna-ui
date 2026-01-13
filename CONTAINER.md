# Aluna UI - Containerfile

# Instrucciones de uso

## Build de la imagen
```bash
# Con Podman
podman build -t aluna-ui:latest -f Containerfile .

# Con Docker
docker build -t aluna-ui:latest -f Containerfile .
```

## Run del contenedor
```bash
# Con Podman
podman run -d \
  --name aluna-ui \
  -p 4176:8080 \
  --env-file .env \
  aluna-ui:latest

# Con Docker
docker run -d \
  --name aluna-ui \
  -p 4176:8080 \
  --env-file .env \
  aluna-ui:latest
```

## Variables de entorno
El contenedor necesita las siguientes variables:
- `VITE_API_BASE_URL`: URL del backend API (ej: https://aluna-api.deployhero.dev)

**Importante**: Las variables de Vite se embeben en el build, por lo que debes reconstruir la imagen si cambias la URL del API.

## Acceder a la aplicación
Abre tu navegador en: http://localhost:4176

## Healthcheck
El contenedor incluye un healthcheck en `/health` que verifica cada 30 segundos.

## Logs
```bash
# Ver logs con Podman
podman logs -f aluna-ui

# Ver logs con Docker
docker logs -f aluna-ui
```

## Stop y remove
```bash
# Con Podman
podman stop aluna-ui
podman rm aluna-ui

# Con Docker
docker stop aluna-ui
docker rm aluna-ui
```

## Multi-stage build
El Containerfile usa un build multi-stage:
1. **Build stage**: Node 20 Alpine con pnpm para compilar el proyecto
2. **Production stage**: Caddy Alpine para servir archivos estáticos

## Tamaño de imagen
- Build stage: ~500MB (descartado)
- Production stage: ~50MB (solo Caddy + assets compilados)

## Características de seguridad
- Headers de seguridad (CSP, X-Frame-Options, etc.)
- HTTPS-ready (Caddy soporta auto-HTTPS)
- Healthcheck incluido
- Logs en formato JSON
- Compresión gzip/zstd

## Deployment en producción
Para producción con dominio propio, actualiza el Caddyfile:
```
your-domain.com {
  # ... configuración actual
}
```

Caddy automáticamente obtendrá certificados SSL de Let's Encrypt.
