# Aluna UI - AI Coding Instructions

## 🏥 Project Overview

**Aluna UI** is the frontend interface for a critical medical AI system that predicts obstetric complications. This React application enables healthcare professionals to input patient data and receive real-time risk assessments for three conditions: **Sepsis**, **Gestational Hypertension**, and **Postpartum Hemorrhage**.

**Critical Context**: This is medical software. Prioritize data accuracy, input validation, and clear communication of risk levels to users.

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7.2 with SWC for Fast Refresh
- **Styling**: CSS Modules (see `App.css`, `index.css`)
- **Linting**: ESLint 9 with flat config, TypeScript-ESLint, React Hooks rules

### Project Structure
```
src/
  ├── App.tsx              # Main application component
  ├── main.tsx             # Application entry point
  ├── index.css            # Global styles
  ├── App.css              # Component-level styles
  └── assets/              # Static assets (images, icons)
```

## 🎯 Core Features to Implement

### 1. Patient Data Form
Create a form component to collect **8 clinical variables**:
- **Edad Materna** (Maternal Age): 15-60 years
- **Paridad** (Parity): 0-20 previous births
- **Controles Prenatales** (Prenatal Controls): 0-20 visits
- **Semanas de Gestación** (Gestational Weeks): 4.0-45.0
- **Hipertensión Previa** (Previous Hypertension): Yes/No
- **Diabetes Gestacional** (Gestational Diabetes): Yes/No
- **Cesárea Previa** (Previous C-section): Yes/No
- **Embarazo Múltiple** (Multiple Pregnancy): Yes/No

**Validation Rules**:
- All numeric inputs must be within specified ranges
- Boolean fields must be explicitly selected
- Form should prevent submission with incomplete/invalid data

### 2. Risk Display Component
Show predictions for 3 conditions with:
- **Probability percentage** (0-100%)
- **Risk level classification**:
  - 🔴 **Alto** (High): ≥70% - Urgent attention required
  - 🟡 **Moderado** (Moderate): ≥50% - Frequent monitoring
  - 🟢 **Bajo** (Low): ≥30% - Standard follow-up
  - ⚪ **Muy Bajo** (Very Low): <30% - Routine follow-up
- **Model confidence level**
- **Specific medical recommendations**

### 3. API Integration (Backend)

**Base URL**: `https://aluna-api.deployhero.dev`  
**Documentation**: https://aluna-api.deployhero.dev/docs

#### Main Endpoints

**Health Check**: `GET /health`
- Verify API status and loaded models
- Use for initialization checks

**Combined Prediction**: `POST /api/v1/predictions/predict`
- Returns predictions for all 3 conditions
- **Primary endpoint for the UI**

**Specific Risk**: `POST /api/v1/predictions/predict/{tipo_riesgo}`
- Available: `sepsis`, `hipertension_gestacional`, `hemorragia_posparto`
- Use for targeted predictions

**Batch Prediction**: `POST /api/v1/predictions/batch`
- Max 100 patients per request
- For bulk processing features

#### Request Payload Structure
```typescript
interface PatientData {
  edadMaterna: number;          // 15-60
  paridad: number;              // 0-20
  controlesPrenatales: number;  // 0-20
  semanasGestacion: number;     // 4.0-45.0 (float)
  hipertensionPrevia: number;   // 0 or 1 (not boolean!)
  diabetesGestacional: number;  // 0 or 1
  cesareaPrevia: number;        // 0 or 1
  embarazoMultiple: number;     // 0 or 1
}
```

**⚠️ Critical**: Boolean fields use `0` (No) and `1` (Yes), not true/false.

#### Response Structure
```typescript
interface PredictionResponse {
  predicciones: Array<{
    riesgo: 'sepsis' | 'hipertension_gestacional' | 'hemorragia_posparto';
    probabilidad: number;        // 0.0-1.0 (convert to percentage)
    nivelRiesgo: 'muy_bajo' | 'bajo' | 'moderado' | 'alto';
    nivelConfianza: 'alta' | 'media' | 'baja';
    recomendacion: string;       // Spanish text with medical guidance
  }>;
  resumen: {
    riesgo_general: 'muy_bajo' | 'bajo' | 'moderado' | 'alto';
    total_riesgos_altos: number;
    total_riesgos_moderados: number;
    total_riesgos_bajos: number;
    requiere_atencion_especial: boolean;
    riesgo_mas_alto: string;
    probabilidad_mas_alta: number;
  };
  datosPaciente: PatientData;
}
```

#### API Integration Example
```typescript
async function predictRisks(patientData: PatientData) {
  const response = await fetch(
    'https://aluna-api.deployhero.dev/api/v1/predictions/predict',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Prediction failed');
  }

  return await response.json();
}
```

## 🎨 Design Conventions

### Naming
- Use **Spanish** for medical terms and labels (matches backend API)
- Use **English** for component/function names and code comments
- Example: `<FormField label="Edad Materna" name="maternalAge" />`

### Component Structure
- Prefer **functional components** with hooks (React 19)
- Use **TypeScript interfaces** for all props and API responses
- Extract reusable components (FormField, RiskIndicator, etc.)

### Styling
- Use CSS modules or component-scoped CSS
- Follow existing patterns in [App.css](App.css) and [index.css](index.css)
- Implement color-coded risk levels consistently across components

#### Risk Level Colors (API Standard)
```css
/* muy_bajo */ --risk-very-low: #10B981;   /* Green */
/* bajo */     --risk-low: #FCD34D;        /* Yellow */
/* moderado */ --risk-moderate: #F59E0B;   /* Orange */
/* alto */     --risk-high: #EF4444;       /* Red */
```

#### Confidence Level Colors
```css
--confidence-high: #10B981;    /* Green */
--confidence-medium: #FCD34D;  /* Yellow */
--confidence-low: #F59E0B;     /* Orange */
```

## 🔧 Development Workflow

### Commands
- `pnpm dev` - Start development server (port 5173)
- `pnpm build` - Type-check + production build
- `pnpm lint` - Run ESLint checks
- `pnpm preview` - Preview production build

### TypeScript Configuration
- Uses **project references** (see [tsconfig.json](tsconfig.js (expect ~100-200ms response time)

### API Error Handling
```typescript
// 422 Validation Error - Invalid input data
{
  "detail": [
    {
      "type": "int_type",
      "loc": ["body", "edadMaterna"],
      "msg": "Input should be a valid integer",
      "input": "invalid_value"
    }
  ]
// Internal form state (English, boolean)
interface FormData {
  maternalAge: number;
  parity: number;
  prenatalControls: number;
  gestationalWeeks: number;
  previousHypertension: boolean;
  gestationalDiabetes: boolean;
  previousCSection: boolean;
  multiplePregnancy: boolean;
}

// API payload (Spanish, 0/1)
interface PatientData {
  edadMaterna: number;
  paridad: number;
  controlesPrenatales: number;
  semanasGestacion: number;
  hipertensionPrevia: number;    // 0 or 1
  diabetesGestacional: number;   // 0 or 1
  cesareaPrevia: number;         // 0 or 1
  embarazoMultiple: number;      // 0 or 1
}

// Transform helper
function toAPIPayload(form: FormData): PatientData {
  return {
    edadMaterna: form.maternalAge,
    paridad: form.parity,
    controlesPrenatales: form.prenatalControls,
    semanasGestacion: form.gestationalWeeks,
    hipertensionPrevia: form.previousHypertension ? 1 : 0,
    diabetesGestacional: form.gestationalDiabetes ? 1 : 0,
    cesareaPrevia: form.previousCSection ? 1 : 0,
    embarazoMultiple: form.multiplePregnancy ? 1 : 0,
  };
}
```
https://aluna-api.deployhero.dev/docs
- **Backend Repo**: https://github.com/christianbueno1/aluna-api
- **API Base URL**: https://aluna-api.deployhero.dev
- **Medical Guidelines**: Model thresholds based on clinical risk assessment standards
- **Vite Documentation**: https://vite.dev/
- **React 19 Docs**: https://react.dev/

## 🧪 Quick API Test
```bash
# Test health endpoint
curl https://aluna-api.deployhero.dev/health

# Test prediction
curl -X POST https://aluna-api.deployhero.dev/api/v1/predictions/predict \
  -H "Content-Type: application/json" \
  -d '{"edadMaterna":28,"paridad":1,"controlesPrenatales":8,"semanasGestacion":39.0,"hipertensionPrevia":0,"diabetesGestacional":0,"cesareaPrevia":0,"embarazoMultiple":0}'
``` percentage
function toPercentage(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}

// Map API risk level to Spanish label
const RISK_LABELS: Record<string, string> = {
  muy_bajo: 'Muy Bajo',
  bajo: 'Bajo',
  moderado: 'Moderado',
  alto: 'Alto',
};

// Map API risk type to Spanish label
const RISK_TYPE_LABELS: Record<string, string> = {
  sepsis: 'Sepsis',
  hipertension_gestacional: 'Hipertensión Gestacional',
  hemorragia_posparto: 'Hemorragia Posparto',
};
```

### Test Cases for Development
```typescript
// Low Risk Patient
const lowRiskPatient: PatientData = {
  edadMaterna: 28,
  paridad: 1,
  controlesPrenatales: 8,
  semanasGestacion: 39.0,
  hipertensionPrevia: 0,
  diabetesGestacional: 0,
  cesareaPrevia: 0,
  embarazoMultiple: 0,
};

// High Risk Patient (Hypertension)
const highRiskPatient: PatientData = {
  edadMaterna: 35,
  paridad: 2,
  controlesPrenatales: 6,
  semanasGestacion: 38.0,
  hipertensionPrevia: 1,
  diabetesGestacional: 0,
  cesareaPrevia: 1,
  embarazoMultiple: 0,
}; if (error.response?.status === 422) {
    // Show validation errors in form
    displayFieldErrors(error.response.data.detail);
  } else if (error.response?.status === 500) {
    // Show generic error message
    showErrorToast('Error del servidor. Intente nuevamente.');
  } else {
    // Network error or timeout
    showErrorToast('No se pudo conectar con el servidor.');
  }
}
```on))
- Strict mode enabled
- Two configs: `tsconfig.app.json` (src) and `tsconfig.node.json` (build tools)

### ESLint Rules
- Uses **flat config** format ([eslint.config.js](eslint.config.js))
- Enforces React Hooks rules
- TypeScript-aware linting

## 🚨 Important Considerations

### Medical Context
- **Data Privacy**: Assume PHI (Protected Health Information) handling
- **Accessibility**: Forms must be keyboard-navigable and screen-reader friendly
- **Error States**: Clearly communicate API failures or validation errors
- **Loading States**: Show progress during prediction requests

### Model Limitations
Be aware of model performance metrics when designing UI feedback:
- **Sepsis**: 56.76% recall, 3.19% precision (high/medium risk)
- **Hypertension**: 50.79% recall, 5.91% precision
- **Hemorrhage**: 77.88% recall, 27.46% precision (most accurate)

Display confidence levels and disclaimers appropriately.

## 📝 Code Examples

### Type-Safe Form State
```typescript
interface PatientData {
  maternalAge: number;
  parity: number;
  prenatalControls: number;
  gestationalWeeks: number;
  previousHypertension: boolean;
  gestationalDiabetes: boolean;
  previousCSection: boolean;
  multiplePregnancy: boolean;
}
```

### Risk Level Helper
```typescript
function getRiskLevel(probability: number): 'high' | 'moderate' | 'low' | 'veryLow' {
  if (probability >= 70) return 'high';
  if (probability >= 50) return 'moderate';
  if (probability >= 30) return 'low';
  return 'veryLow';
}
```

## 🔗 Related Resources
- **Backend API Documentation**: (Add URL when available)
- **Medical Guidelines**: Model thresholds based on clinical risk assessment standards
- **Vite Documentation**: https://vite.dev/
- **React 19 Docs**: https://react.dev/
