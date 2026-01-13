import { AlertCircle, AlertTriangle, CheckCircle2, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PredictionResponse, RiskLevel, RiskType } from '@/types/api.types';

interface RiskResultsProps {
  prediction: PredictionResponse;
  onNewEvaluation: () => void;
}

/**
 * Componente de visualización de resultados de predicción
 * Muestra los 3 riesgos con diseño profesional y código de colores
 */
export function RiskResults({ prediction, onNewEvaluation }: RiskResultsProps) {
  return (
    <div className="w-full px-4">
      {/* Layout principal: 2 columnas desde el inicio */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Columna izquierda: Header + Predicciones */}
        <div className="space-y-6">
          {/* Header con resumen general */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-3xl">Resultados de Evaluación</CardTitle>
                  <CardDescription>
                    Análisis de riesgos obstétricos completado
                  </CardDescription>
                </div>
                <button
                  onClick={onNewEvaluation}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ← Nueva Evaluación
                </button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                <div className="shrink-0">
                  {getRiskIcon(prediction.resumen.riesgo_general, 'h-12 w-12')}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Nivel de Riesgo General</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold">
                      {getRiskLabelSpanish(prediction.resumen.riesgo_general)}
                    </p>
                    {getRiskBadge(prediction.resumen.riesgo_general)}
                  </div>
                </div>
                {prediction.resumen.requiere_atencion_especial && (
                  <Alert className="shrink-0 w-auto border-destructive bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive font-medium">
                      Requiere atención especial
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-red-500/20 border border-red-200">
                  <p className="text-3xl font-bold text-red-600">
                    {prediction.resumen.total_riesgos_altos}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Riesgos Altos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-500/20 border border-orange-300">
                  <p className="text-3xl font-bold text-orange-600">
                    {prediction.resumen.total_riesgos_moderados}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Riesgos Moderados</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/20 border border-yellow-300">
                  <p className="text-3xl font-bold text-yellow-700">
                    {prediction.resumen.total_riesgos_bajos}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Riesgos Bajos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predicciones individuales */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {prediction.predicciones.map((pred) => (
          <Card 
            key={pred.riesgo}
            className={`border-l-4 ${getRiskBorderColor(pred.nivelRiesgo)}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getRiskTypeIcon(pred.riesgo)}
                  <div>
                    <CardTitle className="text-xl">
                      {getRiskTypeLabel(pred.riesgo)}
                    </CardTitle>
                    <CardDescription>
                      {getRiskTypeDescription(pred.riesgo)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getRiskBadge(pred.nivelRiesgo)}
                  <Badge variant="outline" className="text-xs">
                    Confianza: {pred.nivelConfianza}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Barra de probabilidad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Probabilidad</span>
                  <span className="text-2xl font-bold" style={{ color: getRiskColorHex(pred.nivelRiesgo) }}>
                    {(pred.probabilidad * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={pred.probabilidad * 100} 
                  className="h-3"
                />
              </div>

              {/* Recomendación médica */}
              <Alert className={`${getRiskAlertStyle(pred.nivelRiesgo)}`}>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="text-sm leading-relaxed">
                  <strong>Recomendación:</strong> {pred.recomendacion}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))}
          </div>
        </div>

        {/* Columna derecha: Sidebar sticky desde el inicio */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Información del paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Edad Materna</p>
                  <p className="font-semibold">{prediction.datosPaciente.edadMaterna} años</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paridad</p>
                  <p className="font-semibold">{prediction.datosPaciente.paridad}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Controles Prenatales</p>
                  <p className="font-semibold">{prediction.datosPaciente.controlesPrenatales}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Semanas de Gestación</p>
                  <p className="font-semibold">{prediction.datosPaciente.semanasGestacion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer médico */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Aviso Importante:</strong> Este sistema es una herramienta de apoyo para profesionales de la salud. 
              Las predicciones NO reemplazan el juicio clínico ni deben ser el único factor en la toma de decisiones médicas.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

// ========== HELPER FUNCTIONS ==========

function getRiskLabelSpanish(nivel: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    muy_bajo: 'Muy Bajo',
    bajo: 'Bajo',
    moderado: 'Moderado',
    alto: 'Alto',
  };
  return labels[nivel];
}

function getRiskTypeLabel(tipo: RiskType): string {
  const labels: Record<RiskType, string> = {
    sepsis: 'Sepsis',
    hipertension_gestacional: 'Hipertensión Gestacional',
    hemorragia_posparto: 'Hemorragia Posparto',
  };
  return labels[tipo];
}

function getRiskTypeDescription(tipo: RiskType): string {
  const descriptions: Record<RiskType, string> = {
    sepsis: 'Infección sistémica durante embarazo o parto',
    hipertension_gestacional: 'Presión arterial elevada durante el embarazo',
    hemorragia_posparto: 'Sangrado excesivo después del parto',
  };
  return descriptions[tipo];
}

function getRiskTypeIcon(tipo: RiskType): React.ReactElement {
  const icons: Record<RiskType, React.ReactElement> = {
    sepsis: <AlertCircle className="h-6 w-6 text-destructive" />,
    hipertension_gestacional: <TrendingUp className="h-6 w-6 text-primary" />,
    hemorragia_posparto: <AlertTriangle className="h-6 w-6 text-amber-600" />,
  };
  return icons[tipo];
}

function getRiskIcon(nivel: RiskLevel, className: string = 'h-8 w-8') {
  switch (nivel) {
    case 'alto':
      return <AlertCircle className={`${className} text-destructive`} />;
    case 'moderado':
      return <AlertTriangle className={`${className} text-amber-600`} />;
    case 'bajo':
      return <Info className={`${className} text-yellow-600`} />;
    case 'muy_bajo':
      return <CheckCircle2 className={`${className} text-slate-500`} />;
  }
}

function getRiskBadge(nivel: RiskLevel) {
  const config: Record<RiskLevel, { variant: 'default' | 'destructive' | 'outline' | 'secondary', label: string }> = {
    alto: { variant: 'destructive', label: 'ALTO' },
    moderado: { variant: 'default', label: 'MODERADO' },
    bajo: { variant: 'secondary', label: 'BAJO' },
    muy_bajo: { variant: 'outline', label: 'MUY BAJO' },
  };
  
  const { variant, label } = config[nivel];
  return (
    <Badge variant={variant} className="font-bold">
      {label}
    </Badge>
  );
}

function getRiskColorHex(nivel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    alto: '#EF4444',      // Rojo
    moderado: '#F59E0B',  // Naranja/Ámbar
    bajo: '#EAB308',      // Amarillo
    muy_bajo: '#94A3B8',  // Gris neutro
  };
  return colors[nivel];
}

function getRiskBorderColor(nivel: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    alto: 'border-l-destructive',
    moderado: 'border-l-amber-600',
    bajo: 'border-l-yellow-500',
    muy_bajo: 'border-l-slate-400',
  };
  return colors[nivel];
}

function getRiskAlertStyle(nivel: RiskLevel): string {
  const styles: Record<RiskLevel, string> = {
    alto: 'bg-destructive/10 border-destructive text-destructive',
    moderado: 'bg-amber-500/10 border-amber-600 text-amber-900',
    bajo: 'bg-yellow-500/10 border-yellow-600 text-yellow-900',
    muy_bajo: 'bg-slate-100 border-slate-400 text-slate-700',
  };
  return styles[nivel];
}
