import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
  PatientData,
  PatientFormData,
  PredictionResponse,
  SingleRiskPredictionResponse,
  BatchPredictionRequest,
  BatchPredictionResponse,
  HealthCheckResponse,
  RiskType,
  ValidationErrorResponse,
  ErrorResponse,
} from '../types/api.types';
import { config } from '../config';

/**
 * Cliente API para Aluna Backend
 * Base URL configurada en src/config.ts
 */
class AlunaApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = config.apiBaseUrl;

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos
    });

    // Interceptor de respuestas para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const data = error.response.data as ValidationErrorResponse | ErrorResponse;

      switch (status) {
        case 422: {
          // Error de validación
          const validationData = data as ValidationErrorResponse;
          const validationErrors = validationData.detail
            .map((err) => `${err.loc.join('.')}: ${err.msg}`)
            .join(', ');
          return new Error(`Datos inválidos: ${validationErrors}`);
        }

        case 400: {
          // Bad Request
          const badRequestData = data as ErrorResponse;
          return new Error(badRequestData.detail || 'Solicitud inválida');
        }

        case 500:
          // Error interno del servidor
          return new Error('Error del servidor. Por favor, intente nuevamente.');

        default:
          return new Error(`Error HTTP ${status}: ${JSON.stringify(data)}`);
      }
    } else if (error.request) {
      // La solicitud se hizo pero no hubo respuesta
      return new Error('No se pudo conectar con el servidor. Verifique su conexión.');
    } else {
      // Error al configurar la solicitud
      return new Error(`Error: ${error.message}`);
    }
  }

  /**
   * Convierte FormData (con booleanos) a PatientData (con 0/1)
   */
  private formDataToPatientData(formData: PatientFormData): PatientData {
    return {
      edadMaterna: formData.maternalAge,
      paridad: formData.parity,
      controlesPrenatales: formData.prenatalControls,
      semanasGestacion: formData.gestationalWeeks,
      hipertensionPrevia: formData.previousHypertension ? 1 : 0,
      diabetesGestacional: formData.gestationalDiabetes ? 1 : 0,
      cesareaPrevia: formData.previousCSection ? 1 : 0,
      embarazoMultiple: formData.multiplePregnancy ? 1 : 0,
    };
  }

  // ============= ENDPOINTS =============

  /**
   * Health Check - Verificar estado de la API
   * GET /health
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await this.client.get<HealthCheckResponse>('/health');
    return response.data;
  }

  /**
   * Predicción de Riesgos - Todos los riesgos
   * POST /api/v1/predictions/predict
   * 
   * @param formData - Datos del formulario (con booleanos)
   * @returns Predicciones de los 3 riesgos
   */
  async predict(formData: PatientFormData): Promise<PredictionResponse> {
    const patientData = this.formDataToPatientData(formData);
    const response = await this.client.post<PredictionResponse>(
      '/api/v1/predictions/predict',
      patientData
    );
    return response.data;
  }

  /**
   * Predicción de Riesgos - Con PatientData directamente
   * POST /api/v1/predictions/predict
   * 
   * @param patientData - Datos del paciente (con 0/1)
   * @returns Predicciones de los 3 riesgos
   */
  async predictRaw(patientData: PatientData): Promise<PredictionResponse> {
    const response = await this.client.post<PredictionResponse>(
      '/api/v1/predictions/predict',
      patientData
    );
    return response.data;
  }

  /**
   * Predicción de Riesgo Específico
   * POST /api/v1/predictions/predict/{tipo_riesgo}
   * 
   * @param riskType - Tipo de riesgo: sepsis | hipertension_gestacional | hemorragia_posparto
   * @param formData - Datos del formulario
   * @returns Predicción del riesgo específico
   */
  async predictSpecificRisk(
    riskType: RiskType,
    formData: PatientFormData
  ): Promise<SingleRiskPredictionResponse> {
    const patientData = this.formDataToPatientData(formData);
    const response = await this.client.post<SingleRiskPredictionResponse>(
      `/api/v1/predictions/predict/${riskType}`,
      patientData
    );
    return response.data;
  }

  /**
   * Predicción por Lotes
   * POST /api/v1/predictions/batch
   * 
   * @param patients - Array de datos de pacientes (máximo 100)
   * @returns Predicciones para todos los pacientes
   */
  async batchPredict(patients: PatientData[]): Promise<BatchPredictionResponse> {
    if (patients.length > 100) {
      throw new Error('Máximo 100 pacientes por petición');
    }

    const request: BatchPredictionRequest = { pacientes: patients };
    const response = await this.client.post<BatchPredictionResponse>(
      '/api/v1/predictions/batch',
      request
    );
    return response.data;
  }

  /**
   * Predicción por Lotes - Con FormData
   * POST /api/v1/predictions/batch
   * 
   * @param formDataList - Array de datos de formulario
   * @returns Predicciones para todos los pacientes
   */
  async batchPredictFromForm(
    formDataList: PatientFormData[]
  ): Promise<BatchPredictionResponse> {
    const patients = formDataList.map((formData) =>
      this.formDataToPatientData(formData)
    );
    return this.batchPredict(patients);
  }
}

// Exportar instancia única (singleton)
export const alunaApi = new AlunaApiClient();

// También exportar la clase para testing o múltiples instancias
export default AlunaApiClient;
