# Aluna UI - Containerfile

# Instrucciones de uso

## Build de la imagen
```bash
# Con Podman
podman build -t aluna-ui:latest -f Containerfile .

# Con Docker
docker build -t aluna-ui:latest -f Containerfile .
```

**Nota**: La URL del API está configurada en `src/config.ts` (valor público, no secreto).

## Run del contenedor
```bash
# Con Podman (NO necesita --env-file porque las vars están en el build)
podman run -d \
  --name aluna-ui \
  -p 4176:8080 \
  aluna-ui:latest

# Con Docker
docker run -d \
  --name aluna-ui \
  -p 4176:8080 \
  aluna-ui:latest
```

## Configuración del API
La URL del API backend está definida en `src/config.ts`:
```typescript
apiBaseUrl: 'https://aluna-api.deployhero.dev'
```

Para cambiar la URL del API, edita el archivo y reconstruye la imagen.

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

# portmapping of the container
4176:8080

# create repo 
```bash
gh repo create aluna-ui --public --description "Interfaz web para predicción de riesgos obstétricos - Frontend React + TypeScript para evaluación de Sepsis, Hipertensión Gestacional y Hemorragia Posparto" --source=. --remote=origin
git push -u origin main
```

# Deploy con Podman

## Opción 1: Kube Play (recomendado)
```bash
podman pod stop aluna-ui-pod && podman pod rm aluna-ui-pod
podman kube play --network aluna-net aluna-ui-pod.yaml
```

## Opción 2: Manual
```bash
podman pod stop aluna-ui-pod && podman pod rm aluna-ui-pod
podman pod create --name aluna-ui-pod --network aluna-net --publish 4176:8080
podman run -d --name aluna-ui --pod aluna-ui-pod aluna-ui:latest
```

## Regenerar manifest
```bash
podman kube generate aluna-ui-pod > aluna-ui-pod.yaml
```
