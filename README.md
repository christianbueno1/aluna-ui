# 🏥 Aluna UI - Sistema de Predicción de Riesgos Obstétricos

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vite.dev/)

**Aluna UI** es la interfaz frontend para un sistema inteligente de predicción de complicaciones obstétricas. Permite a profesionales de la salud ingresar datos clínicos de pacientes embarazadas y recibir evaluaciones de riesgo en tiempo real para tres condiciones críticas.

## 🎯 Funcionalidades Principales

- ✅ **Formulario de Datos Clínicos**: Captura 8 variables obstétricas
- ✅ **Predicción de 3 Riesgos**: Sepsis, Hipertensión Gestacional, Hemorragia Posparto
- ✅ **Clasificación de Riesgo**: 4 niveles (Muy Bajo, Bajo, Moderado, Alto)
- ✅ **Recomendaciones Médicas**: Guías específicas basadas en la predicción
- ✅ **Interfaz Intuitiva**: Diseño optimizado para uso clínico

## 🤖 Riesgos Predichos

| Riesgo | Descripción |
|--------|-------------|
| **Sepsis** | Infección sistémica durante embarazo/parto |
| **Hipertensión Gestacional** | Presión arterial alta durante el embarazo |
| **Hemorragia Posparto** | Sangrado excesivo después del parto |

## 📊 Variables Clínicas

El sistema analiza **8 variables** para generar las predicciones:

1. **Edad Materna** (15-60 años)
2. **Paridad** - Número de partos previos (0-20)
3. **Controles Prenatales** (0-20)
4. **Semanas de Gestación** (4.0-45.0)
5. **Hipertensión Previa** (Sí/No)
6. **Diabetes Gestacional** (Sí/No)
7. **Cesárea Previa** (Sí/No)
8. **Embarazo Múltiple** (Sí/No)

## 🚀 Stack Tecnológico

- **Framework**: React 19.2
- **Lenguaje**: TypeScript 5.9
- **Build Tool**: Vite 7.2 con SWC
- **Estilos**: Tailwind CSS + shadcn/ui
- **HTTP Client**: Axios
- **Linting**: ESLint 9 (flat config)
- **Package Manager**: pnpm

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/aluna-ui.git
cd aluna-ui

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Comandos Disponibles

```bash
pnpm dev      # Iniciar servidor de desarrollo
pnpm build    # Compilar para producción (TypeScript + Vite)
pnpm lint     # Ejecutar ESLint
pnpm preview  # Vista previa de build de producción
```

## 🌐 Backend API

La aplicación se conecta al backend FastAPI de Aluna:

- **URL Base**: `https://aluna-api.deployhero.dev`
- **Documentación**: https://aluna-api.deployhero.dev/docs
- **Repositorio**: https://github.com/christianbueno1/aluna-api

### Endpoint Principal

```typescript
POST /api/v1/predictions/predict

// Payload
{
  edadMaterna: 35,
  paridad: 2,
  controlesPrenatales: 6,
  semanasGestacion: 38.0,
  hipertensionPrevia: 1,      // 0 = No, 1 = Sí
  diabetesGestacional: 0,
  cesareaPrevia: 1,
  embarazoMultiple: 0
}

// Respuesta
{
  predicciones: [
    {
      riesgo: "sepsis",
      probabilidad: 0.2675,
      nivelRiesgo: "muy_bajo",
      nivelConfianza: "media",
      recomendacion: "Seguimiento rutinario prenatal..."
    },
    // ... más predicciones
  ],
  resumen: {
    riesgo_general: "alto",
    total_riesgos_altos: 1,
    requiere_atencion_especial: true
  }
}
```

## 🎨 Niveles de Riesgo

| Nivel | Umbral | Color | Acción |
|-------|--------|-------|--------|
| 🔴 **Alto** | ≥70% | Rojo (#EF4444) | Atención urgente |
| 🟡 **Moderado** | ≥50% | Naranja (#F59E0B) | Monitoreo frecuente |
| 🟢 **Bajo** | ≥30% | Amarillo (#FCD34D) | Seguimiento estándar |
| ⚪ **Muy Bajo** | <30% | Verde (#10B981) | Seguimiento rutinario |

## 📁 Estructura del Proyecto

```
aluna-ui/
├── src/
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   ├── index.css            # Estilos globales + Tailwind
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   └── ApiTest.tsx      # Componente de prueba (temporal)
│   ├── services/            # Servicios (API client)
│   ├── types/               # Tipos TypeScript
│   └── assets/              # Recursos estáticos
├── public/                  # Archivos públicos
├── .github/
│   ├── copilot-instructions.md  # Guía para AI agents
│   └── instructions/
├── components.json          # Configuración shadcn/ui
├── tailwind.config.js       # Configuración Tailwind CSS
├── eslint.config.js         # Configuración ESLint
├── tsconfig.json            # Configuración TypeScript
├── vite.config.ts           # Configuración Vite
└── package.json
```

## 🔧 Configuración TypeScript

El proyecto usa **project references** para separar la configuración:

- `tsconfig.app.json` - Código de la aplicación (src/)
- `tsconfig.node.json` - Build tools (vite.config.ts, etc.)

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

**Importante**: Lee [.github/copilot-instructions.md](.github/copilot-instructions.md) para entender las convenciones del proyecto.

## 📄 Licencia

Este proyecto es privado y está destinado exclusivamente para uso médico profesional.

## 🩺 Aviso Médico

**IMPORTANTE**: Este sistema es una herramienta de apoyo para profesionales de la salud. Las predicciones NO reemplazan el juicio clínico ni deben ser el único factor en la toma de decisiones médicas. Siempre consulte con personal médico calificado.

## 📞 Contacto

- **Backend API**: https://aluna-api.deployhero.dev
- **Documentación**: https://aluna-api.deployhero.dev/docs

---

Desarrollado con ❤️ para mejorar la atención obstétrica | Enero 2026

# portmapping of the container
4176:8080