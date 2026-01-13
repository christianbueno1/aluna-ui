import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { PatientFormData } from '@/types/api.types';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  loading?: boolean;
}

/**
 * Formulario de captura de datos clínicos del paciente
 * 8 variables para predicción de riesgos obstétricos
 * Con validación completa de datos
 */
export function PatientForm({ onSubmit, loading = false }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    maternalAge: 28,
    parity: 0,
    prenatalControls: 0,
    gestationalWeeks: 20.0,
    previousHypertension: false,
    gestationalDiabetes: false,
    previousCSection: false,
    multiplePregnancy: false,
  });

  // Estado para valores como strings mientras se editan
  const [inputValues, setInputValues] = useState({
    maternalAge: '28',
    parity: '0',
    prenatalControls: '0',
    gestationalWeeks: '20.0',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PatientFormData, boolean>>>({});

  // Validación de campos con mensajes específicos
  const validateField = (name: keyof PatientFormData, value: number | boolean): string | null => {
    if (typeof value === 'boolean') return null;

    // Validar que sea un número válido
    if (isNaN(value)) {
      return 'Valor inválido';
    }

    switch (name) {
      case 'maternalAge':
        if (!Number.isInteger(value)) return 'La edad debe ser un número entero';
        if (value < 15) return 'Edad mínima: 15 años';
        if (value > 60) return 'Edad máxima: 60 años';
        break;
      case 'parity':
        if (!Number.isInteger(value)) return 'La paridad debe ser un número entero';
        if (value < 0) return 'La paridad no puede ser negativa';
        if (value > 20) return 'Valor máximo: 20';
        break;
      case 'prenatalControls':
        if (!Number.isInteger(value)) return 'Los controles deben ser un número entero';
        if (value < 0) return 'Los controles no pueden ser negativos';
        if (value > 20) return 'Valor máximo: 20';
        break;
      case 'gestationalWeeks':
        if (value < 4.0) return 'Mínimo: 4.0 semanas';
        if (value > 45.0) return 'Máximo: 45.0 semanas';
        // Validar que tenga máximo 1 decimal
        if (Math.round(value * 10) !== value * 10) {
          return 'Máximo 1 decimal permitido';
        }
        break;
    }
    return null;
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (name: keyof PatientFormData, value: string) => {
    // Actualizar el valor string del input
    setInputValues((prev) => ({ ...prev, [name]: value }));

    // Si está vacío, marcar como error requerido
    if (value === '') {
      setErrors((prev) => ({ ...prev, [name]: 'Este campo es requerido' }));
      return;
    }

    // Convertir a número
    const numValue = name === 'gestationalWeeks' ? parseFloat(value) : parseInt(value);
    
    // Validar que sea un número
    if (isNaN(numValue)) {
      setErrors((prev) => ({ ...prev, [name]: 'Ingrese un número válido' }));
      return;
    }

    // Validar rango y actualizar formData
    const error = validateField(name, numValue);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  // Manejar blur para marcar campo como "touched"
  const handleBlur = (name: keyof PatientFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Manejar cambios en switches
  const handleSwitchChange = (name: keyof PatientFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Validar formulario completo antes de enviar
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};
    let isValid = true;

    // Validar campos numéricos
    const numericFields: (keyof PatientFormData)[] = [
      'maternalAge',
      'parity', 
      'prenatalControls',
      'gestationalWeeks'
    ];

    numericFields.forEach((field) => {
      const value = formData[field] as number;
      const inputValue = inputValues[field as keyof typeof inputValues];

      // Verificar que el campo no esté vacío
      if (inputValue === '' || inputValue === undefined) {
        newErrors[field] = 'Este campo es requerido';
        isValid = false;
        return;
      }

      // Validar el valor numérico
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Marcar todos los campos como touched para mostrar errores
    if (!isValid) {
      const allTouched: Partial<Record<keyof PatientFormData, boolean>> = {};
      numericFields.forEach((field) => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
    }

    return isValid;
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Contar errores actuales
  const errorCount = Object.keys(errors).filter((key) => errors[key as keyof PatientFormData]).length;

  return (
    <Card className="w-full mx-auto px-4">
      <CardHeader>
        <CardTitle className="text-2xl">Datos del Paciente</CardTitle>
        <CardDescription>
          Ingrese los datos clínicos para evaluar riesgos obstétricos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerta de errores */}
          {errorCount > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorCount === 1 
                  ? 'Hay 1 campo con error. Por favor, corrígelo antes de continuar.'
                  : `Hay ${errorCount} campos con errores. Por favor, corrígelos antes de continuar.`
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Layout de 2 columnas */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Columna izquierda: Datos Numéricos */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Datos Numéricos</h3>
              
              {/* Edad Materna */}
              <div className="space-y-2">
              <Label htmlFor="maternalAge">
                Edad Materna <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maternalAge"
                type="number"
                min="15"
                max="60"
                value={inputValues.maternalAge}
                onChange={(e) => handleNumberChange('maternalAge', e.target.value)}
                onBlur={() => handleBlur('maternalAge')}
                disabled={loading}
                className={errors.maternalAge && touched.maternalAge ? 'border-destructive' : ''}
              />
              {errors.maternalAge && touched.maternalAge && (
                <p className="text-sm text-destructive">{errors.maternalAge}</p>
              )}
              <p className="text-xs text-muted-foreground">15-60 años</p>
            </div>

            {/* Paridad */}
            <div className="space-y-2">
              <Label htmlFor="parity">
                Paridad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="parity"
                type="number"
                min="0"
                max="20"
                value={inputValues.parity}
                onChange={(e) => handleNumberChange('parity', e.target.value)}
                onBlur={() => handleBlur('parity')}
                disabled={loading}
                className={errors.parity && touched.parity ? 'border-destructive' : ''}
              />
              {errors.parity && touched.parity && (
                <p className="text-sm text-destructive">{errors.parity}</p>
              )}
              <p className="text-xs text-muted-foreground">Número de partos previos (0-20)</p>
            </div>

            {/* Controles Prenatales */}
            <div className="space-y-2">
              <Label htmlFor="prenatalControls">
                Controles Prenatales <span className="text-destructive">*</span>
              </Label>
              <Input
                id="prenatalControls"
                type="number"
                min="0"
                max="20"
                value={inputValues.prenatalControls}
                onChange={(e) => handleNumberChange('prenatalControls', e.target.value)}
                onBlur={() => handleBlur('prenatalControls')}
                disabled={loading}
                className={errors.prenatalControls && touched.prenatalControls ? 'border-destructive' : ''}
              />
              {errors.prenatalControls && touched.prenatalControls && (
                <p className="text-sm text-destructive">{errors.prenatalControls}</p>
              )}
              <p className="text-xs text-muted-foreground">Cantidad de controles (0-20)</p>
            </div>

            {/* Semanas de Gestación */}
            <div className="space-y-2">
              <Label htmlFor="gestationalWeeks">
                Semanas de Gestación <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gestationalWeeks"
                type="number"
                step="0.1"
                min="4.0"
                max="45.0"
                value={inputValues.gestationalWeeks}
                onChange={(e) => handleNumberChange('gestationalWeeks', e.target.value)}
                onBlur={() => handleBlur('gestationalWeeks')}
                disabled={loading}
                className={errors.gestationalWeeks && touched.gestationalWeeks ? 'border-destructive' : ''}
              />
              {errors.gestationalWeeks && touched.gestationalWeeks && (
                <p className="text-sm text-destructive">{errors.gestationalWeeks}</p>
              )}
              <p className="text-xs text-muted-foreground">4.0-45.0 semanas</p>
            </div>
            </div>

            {/* Columna derecha: Condiciones Previas */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Condiciones Previas</h3>
            
            <div className="space-y-4">
              {/* Hipertensión Previa */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label htmlFor="previousHypertension" className="text-base">
                    Hipertensión Previa
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ¿La paciente tiene diagnóstico previo de hipertensión?
                  </p>
                </div>
                <Switch
                  id="previousHypertension"
                  checked={formData.previousHypertension}
                  onCheckedChange={(checked) => handleSwitchChange('previousHypertension', checked)}
                  disabled={loading}
                />
              </div>

              {/* Diabetes Gestacional */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label htmlFor="gestationalDiabetes" className="text-base">
                    Diabetes Gestacional
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ¿La paciente tiene diabetes gestacional?
                  </p>
                </div>
                <Switch
                  id="gestationalDiabetes"
                  checked={formData.gestationalDiabetes}
                  onCheckedChange={(checked) => handleSwitchChange('gestationalDiabetes', checked)}
                  disabled={loading}
                />
              </div>

              {/* Cesárea Previa */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label htmlFor="previousCSection" className="text-base">
                    Cesárea Previa
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ¿La paciente ha tenido cesáreas previas?
                  </p>
                </div>
                <Switch
                  id="previousCSection"
                  checked={formData.previousCSection}
                  onCheckedChange={(checked) => handleSwitchChange('previousCSection', checked)}
                  disabled={loading}
                />
              </div>

              {/* Embarazo Múltiple */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <div className="space-y-0.5">
                  <Label htmlFor="multiplePregnancy" className="text-base">
                    Embarazo Múltiple
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ¿Es un embarazo gemelar o múltiple?
                  </p>
                </div>
                <Switch
                  id="multiplePregnancy"
                  checked={formData.multiplePregnancy}
                  onCheckedChange={(checked) => handleSwitchChange('multiplePregnancy', checked)}
                  disabled={loading}
                />
              </div>
            </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={loading || errorCount > 0}
          >
            {loading ? 'Analizando...' : 'Evaluar Riesgos'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
