import { useState } from 'react';
import { PatientForm } from './components/PatientForm';
import { RiskResults } from './components/RiskResults';
import { ApiTest } from './components/ApiTest';
import { alunaApi } from './services/api';
import type { PatientFormData, PredictionResponse } from './types/api.types';

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);

  const handleFormSubmit = async (formData: PatientFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await alunaApi.predict(formData);
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

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🏥 Aluna
            </h1>
            <p className="text-muted-foreground">
              Sistema de Predicción de Riesgos Obstétricos
            </p>
          </div>
          
          <button
            onClick={() => setShowTest(!showTest)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {showTest ? 'Ver Formulario' : 'Ver Pruebas'}
          </button>
        </div>
      </div>

      {/* Toggle entre formulario y pruebas */}
      {showTest ? (
        <ApiTest />
      ) : (
        <>
          {/* Mostrar errores */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <p className="text-destructive font-medium">❌ Error</p>
                <p className="text-sm text-destructive/90 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Formulario o Resultados */}
          {!prediction ? (
            <PatientForm onSubmit={handleFormSubmit} loading={loading} />
          ) : (
            <RiskResults prediction={prediction} onNewEvaluation={handleReset} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
