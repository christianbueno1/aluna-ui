import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { PatientFormData } from '@/types/api.types';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  loading?: boolean;
}

/**
 * Formulario de captura de datos clínicos del paciente
 * 8 variables para predicción de riesgos obstétricos
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

  // Validación de campos
  const validateField = (name: keyof PatientFormData, value: number | boolean): string | null => {
    if (typeof value === 'boolean') return null;

    switch (name) {
      case 'maternalAge':
        if (value < 15 || value > 60) return 'Edad debe estar entre 15 y 60 años';
        break;
      case 'parity':
        if (value < 0 || value > 20) return 'Paridad debe estar entre 0 y 20';
        break;
      case 'prenatalControls':
        if (value < 0 || value > 20) return 'Controles deben estar entre 0 y 20';
        break;
      case 'gestationalWeeks':
        if (value < 4.0 || value > 45.0) return 'Semanas deben estar entre 4.0 y 45.0';
        break;
    }
    return null;
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (name: keyof PatientFormData, value: string) => {
    // Actualizar el valor string del input
    setInputValues((prev) => ({ ...prev, [name]: value }));

    // Si está vacío, limpiar errores pero no actualizar formData aún
    if (value === '') {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return;
    }

    // Convertir a número
    const numValue = name === 'gestationalWeeks' ? parseFloat(value) : parseInt(value);
    
    // Solo actualizar formData si es un número válido
    if (!isNaN(numValue)) {
      const error = validateField(name, numValue);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    }
  };

  // Manejar cambios en switches
  const handleSwitchChange = (name: keyof PatientFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'number') {
        const error = validateField(key as keyof PatientFormData, value);
        if (error) {
          newErrors[key as keyof PatientFormData] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Datos del Paciente</CardTitle>
        <CardDescription>
          Ingrese los datos clínicos para evaluar riesgos obstétricos
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Numéricos */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Edad Materna */}
            <div className="space-y-2">
              <Label htmlFor="maternalAge">
                Edad Materna <span className="text-destructive">*</span>
              </Label>
              <Input
                id="matinputValues"
                type="number"
                min="15"
                max="60"
                value={formData.maternalAge}
                onChange={(e) => handleNumberChange('maternalAge', e.target.value)}
                disabled={loading}
                className={errors.maternalAge ? 'border-destructive' : ''}
              />
              {errors.maternalAge && (
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
                disabled={loading}
                className={errors.parity ? 'border-destructive' : ''}
              />
              {errors.parity && (
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
                disabled={loading}
                className={errors.prenatalControls ? 'border-destructive' : ''}
              />
              {errors.prenatalControls && (
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
                disabled={loading}
                className={errors.gestationalWeeks ? 'border-destructive' : ''}
              />
              {errors.gestationalWeeks && (
                <p className="text-sm text-destructive">{errors.gestationalWeeks}</p>
              )}
              <p className="text-xs text-muted-foreground">4.0-45.0 semanas</p>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Condiciones Previas</h3>
            
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

          {/* Botón de Envío */}
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Analizando...' : 'Evaluar Riesgos'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
