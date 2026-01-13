import { useState } from 'react';
import { alunaApi } from '../services/api';
import type { PredictionResponse, HealthCheckResponse } from '../types/api.types';

/**
 * Componente de prueba para verificar la integración con la API
 * ELIMINAR después de verificar que funciona
 */
export function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prueba 1: Health Check
  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await alunaApi.healthCheck();
      setHealthStatus(result);
      console.log('✅ Health Check exitoso:', result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error en Health Check:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Prueba 2: Predicción con paciente de bajo riesgo
  const testLowRiskPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await alunaApi.predict({
        maternalAge: 28,
        parity: 1,
        prenatalControls: 8,
        gestationalWeeks: 39.0,
        previousHypertension: false,
        gestationalDiabetes: false,
        previousCSection: false,
        multiplePregnancy: false,
      });
      setPrediction(result);
      console.log('✅ Predicción exitosa:', result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error en predicción:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Prueba 3: Predicción con paciente de alto riesgo
  const testHighRiskPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await alunaApi.predict({
        maternalAge: 35,
        parity: 2,
        prenatalControls: 6,
        gestationalWeeks: 38.0,
        previousHypertension: true,
        gestationalDiabetes: false,
        previousCSection: true,
        multiplePregnancy: false,
      });
      setPrediction(result);
      console.log('✅ Predicción exitosa (alto riesgo):', result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      console.error('❌ Error en predicción:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🧪 Pruebas de API - Aluna</h1>
      
      {/* Botones de prueba */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={testHealthCheck}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          1. Health Check
        </button>
        
        <button
          onClick={testLowRiskPrediction}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          2. Predicción (Bajo Riesgo)
        </button>
        
        <button
          onClick={testHighRiskPrediction}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          3. Predicción (Alto Riesgo)
        </button>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div style={{
          padding: '15px',
          backgroundColor: '#F3F4F6',
          borderRadius: '5px',
          marginBottom: '20px',
        }}>
          ⏳ Cargando...
        </div>
      )}

      {/* Errores */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#FEE2E2',
          border: '1px solid #EF4444',
          borderRadius: '5px',
          color: '#991B1B',
          marginBottom: '20px',
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Resultado Health Check */}
      {healthStatus && (
        <div style={{
          padding: '15px',
          backgroundColor: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '5px',
          marginBottom: '20px',
        }}>
          <h3>✅ Health Check</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(healthStatus, null, 2)}
          </pre>
        </div>
      )}

      {/* Resultado Predicción */}
      {prediction && (
        <div style={{
          padding: '15px',
          backgroundColor: '#DBEAFE',
          border: '1px solid #3B82F6',
          borderRadius: '5px',
        }}>
          <h3>📊 Resultado de Predicción</h3>
          
          {/* Resumen */}
          <div style={{
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '5px',
            marginBottom: '15px',
          }}>
            <h4>Resumen General</h4>
            <p><strong>Riesgo General:</strong> {prediction.resumen.riesgo_general.toUpperCase()}</p>
            <p><strong>Requiere atención especial:</strong> {prediction.resumen.requiere_atencion_especial ? 'SÍ' : 'NO'}</p>
            <p><strong>Riesgos altos:</strong> {prediction.resumen.total_riesgos_altos}</p>
            <p><strong>Riesgos moderados:</strong> {prediction.resumen.total_riesgos_moderados}</p>
          </div>

          {/* Predicciones individuales */}
          {prediction.predicciones.map((pred) => (
            <div
              key={pred.riesgo}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '5px',
                marginBottom: '10px',
                borderLeft: `4px solid ${getRiskColor(pred.nivelRiesgo)}`,
              }}
            >
              <h4 style={{ margin: '0 0 10px 0' }}>
                {getRiskLabel(pred.riesgo)}
              </h4>
              <p>
                <strong>Probabilidad:</strong> {(pred.probabilidad * 100).toFixed(1)}%
              </p>
              <p>
                <strong>Nivel de Riesgo:</strong>{' '}
                <span style={{ color: getRiskColor(pred.nivelRiesgo) }}>
                  {pred.nivelRiesgo.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Confianza:</strong> {pred.nivelConfianza}
              </p>
              <p>
                <strong>Recomendación:</strong> {pred.recomendacion}
              </p>
            </div>
          ))}

          {/* JSON completo */}
          <details style={{ marginTop: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Ver JSON completo
            </summary>
            <pre style={{
              fontSize: '11px',
              overflow: 'auto',
              backgroundColor: '#F9FAFB',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px',
            }}>
              {JSON.stringify(prediction, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#FEF3C7',
        borderRadius: '5px',
        fontSize: '14px',
      }}>
        <strong>💡 Nota:</strong> Abre la consola del navegador (F12) para ver logs detallados.
      </div>
    </div>
  );
}

// Helpers para colores y labels
function getRiskColor(nivel: string): string {
  const colors: Record<string, string> = {
    muy_bajo: '#10B981',
    bajo: '#FCD34D',
    moderado: '#F59E0B',
    alto: '#EF4444',
  };
  return colors[nivel] || '#6B7280';
}

function getRiskLabel(riesgo: string): string {
  const labels: Record<string, string> = {
    sepsis: 'Sepsis',
    hipertension_gestacional: 'Hipertensión Gestacional',
    hemorragia_posparto: 'Hemorragia Posparto',
  };
  return labels[riesgo] || riesgo;
}
