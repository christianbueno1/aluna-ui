/**
 * Tipos para la API de Aluna
 * Backend: https://aluna-api.deployhero.dev
 */

// ============= REQUEST TYPES =============

/**
 * Datos del paciente para enviar al API
 * IMPORTANTE: Los booleanos se envían como 0 (No) o 1 (Sí)
 */
export interface PatientData {
  edadMaterna: number;          // 15-60 años
  paridad: number;              // 0-20 partos previos
  controlesPrenatales: number;  // 0-20 controles
  semanasGestacion: number;     // 4.0-45.0 semanas (float)
  hipertensionPrevia: number;   // 0 = No, 1 = Sí
  diabetesGestacional: number;  // 0 = No, 1 = Sí
  cesareaPrevia: number;        // 0 = No, 1 = Sí
  embarazoMultiple: number;     // 0 = No, 1 = Sí
}

/**
 * Request para predicción por lotes
 */
export interface BatchPredictionRequest {
  pacientes: PatientData[];
}

// ============= RESPONSE TYPES =============

/**
 * Tipos de riesgo que puede predecir el sistema
 */
export type RiskType = 
  | 'sepsis'
  | 'hipertension_gestacional'
  | 'hemorragia_posparto';

/**
 * Niveles de riesgo (basados en probabilidad)
 */
export type RiskLevel = 
  | 'muy_bajo'  // < 30%
  | 'bajo'      // >= 30% y < 50%
  | 'moderado'  // >= 50% y < 70%
  | 'alto';     // >= 70%

/**
 * Niveles de confianza del modelo
 */
export type ConfidenceLevel = 
  | 'alta'      // >= 80%
  | 'media'     // >= 60% y < 80%
  | 'baja';     // < 60%

/**
 * Predicción individual de un riesgo específico
 */
export interface RiskPrediction {
  riesgo: RiskType;
  probabilidad: number;              // 0.0 - 1.0 (multiplicar x100 para %)
  nivelRiesgo: RiskLevel;
  nivelConfianza: ConfidenceLevel;
  recomendacion: string;             // Texto en español con guía médica
}

/**
 * Resumen general de todos los riesgos
 */
export interface PredictionSummary {
  riesgo_general: RiskLevel;
  total_riesgos_altos: number;
  total_riesgos_moderados: number;
  total_riesgos_bajos: number;
  requiere_atencion_especial: boolean;
  riesgo_mas_alto: string;
  probabilidad_mas_alta: number;      // 0.0 - 1.0
}

/**
 * Respuesta completa de predicción (endpoint principal)
 */
export interface PredictionResponse {
  predicciones: RiskPrediction[];
  resumen: PredictionSummary;
  datosPaciente: PatientData;
}

/**
 * Respuesta de predicción de riesgo específico
 */
export interface SingleRiskPredictionResponse extends RiskPrediction {
  datosPaciente: PatientData;
}

/**
 * Resultado de predicción para un paciente en batch
 */
export interface BatchPredictionResult {
  id_paciente: number;
  predicciones: RiskPrediction[];
  resumen: PredictionSummary;
  datosPaciente: PatientData;
}

/**
 * Estadísticas del lote procesado
 */
export interface BatchStatistics {
  total_pacientes: number;
  riesgos_altos: number;
  riesgos_moderados: number;
  riesgos_bajos: number;
  casos_urgentes: number;
}

/**
 * Respuesta completa de predicción por lotes
 */
export interface BatchPredictionResponse {
  resultados: BatchPredictionResult[];
  estadisticas: BatchStatistics;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  models_loaded: number;
  models: RiskType[];
}

// ============= ERROR TYPES =============

/**
 * Detalle de error de validación (422)
 */
export interface ValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input: unknown;
}

/**
 * Respuesta de error de validación
 */
export interface ValidationErrorResponse {
  detail: ValidationError[];
}

/**
 * Respuesta de error genérico (400, 500)
 */
export interface ErrorResponse {
  detail: string;
}

// ============= FORM TYPES (FRONTEND) =============

/**
 * Datos del formulario (uso interno, con booleanos reales)
 * Se convierte a PatientData antes de enviar al API
 */
export interface PatientFormData {
  maternalAge: number;
  parity: number;
  prenatalControls: number;
  gestationalWeeks: number;
  previousHypertension: boolean;
  gestationalDiabetes: boolean;
  previousCSection: boolean;
  multiplePregnancy: boolean;
}
