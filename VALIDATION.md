# Validación de Datos del Formulario

## ✅ Implementación Completa

El formulario `PatientForm` ahora cuenta con validación robusta de todos los datos de entrada.

## 🔍 Validaciones por Campo

### Campos Numéricos Enteros

#### 1. **Edad Materna** (`maternalAge`)
- ✓ Valor requerido (no puede estar vacío)
- ✓ Debe ser un número entero válido
- ✓ Rango: 15-60 años
- ✓ Mensaje de error específico para cada caso

#### 2. **Paridad** (`parity`)
- ✓ Valor requerido (no puede estar vacío)
- ✓ Debe ser un número entero válido
- ✓ Rango: 0-20 partos previos
- ✓ No permite valores negativos
- ✓ Mensaje de error específico para cada caso

#### 3. **Controles Prenatales** (`prenatalControls`)
- ✓ Valor requerido (no puede estar vacío)
- ✓ Debe ser un número entero válido
- ✓ Rango: 0-20 controles
- ✓ No permite valores negativos
- ✓ Mensaje de error específico para cada caso

### Campo Numérico Decimal

#### 4. **Semanas de Gestación** (`gestationalWeeks`)
- ✓ Valor requerido (no puede estar vacío)
- ✓ Puede ser número decimal
- ✓ Rango: 4.0-45.0 semanas
- ✓ Máximo 1 decimal permitido (ej: 39.5 ✓, 39.25 ✗)
- ✓ Mensaje de error específico para cada caso

### Campos Booleanos (Switches)

#### 5-8. Condiciones Previas
- `previousHypertension` - Hipertensión Previa
- `gestationalDiabetes` - Diabetes Gestacional
- `previousCSection` - Cesárea Previa
- `multiplePregnancy` - Embarazo Múltiple

**Validación**: Estos campos son switches y siempre tienen un valor válido (true/false), no requieren validación adicional.

## 🎯 Funcionalidad de Validación

### 1. Validación en Tiempo Real
- Los campos se validan mientras el usuario escribe
- Los errores se muestran solo después de que el usuario interactúa con el campo ("touched")
- Los errores desaparecen automáticamente cuando el usuario corrige el valor

### 2. Prevención de Envío
- El botón "Evaluar Riesgos" se deshabilita si hay errores activos
- No se puede enviar el formulario con datos inválidos
- Se muestra un contador de errores en la parte superior del formulario

### 3. Mensajes de Error Contextuales
Cada tipo de error muestra un mensaje específico:
- **Campo vacío**: "Este campo es requerido"
- **Valor no numérico**: "Ingrese un número válido"
- **No es entero**: "La edad debe ser un número entero"
- **Fuera de rango**: "Edad mínima: 15 años" / "Edad máxima: 60 años"
- **Demasiados decimales**: "Máximo 1 decimal permitido"

### 4. Alerta Visual de Errores
Cuando hay errores, se muestra una alerta roja en la parte superior:
```
⚠️ Hay N campos con errores. Por favor, corrígelos antes de continuar.
```

### 5. Validación Pre-Envío
Antes de enviar el formulario al API:
1. Se validan todos los campos numéricos
2. Se verifica que no estén vacíos
3. Se valida que estén dentro de los rangos permitidos
4. Se marcan todos los campos como "touched" para mostrar errores
5. Solo se permite el envío si todos los campos son válidos

## 🔧 Implementación Técnica

### Estados de Validación
```typescript
// Valores del formulario (numéricos para el API)
formData: PatientFormData

// Valores como strings para permitir edición libre
inputValues: { maternalAge, parity, prenatalControls, gestationalWeeks }

// Mensajes de error por campo
errors: Partial<Record<keyof PatientFormData, string>>

// Campos que el usuario ha tocado
touched: Partial<Record<keyof PatientFormData, boolean>>
```

### Función de Validación Principal
```typescript
validateField(name, value): string | null
```
- Retorna `null` si el campo es válido
- Retorna un mensaje de error específico si es inválido
- Valida tipo (entero vs decimal), rango y formato

### Flujo de Validación
1. Usuario escribe en campo → `handleNumberChange()`
2. Se actualiza `inputValues` (string) y `formData` (number)
3. Se ejecuta `validateField()` automáticamente
4. Error se guarda en estado `errors`
5. Al hacer blur → campo marcado como `touched`
6. Errores solo se muestran si campo está `touched`
7. Al enviar → `validateForm()` valida todo
8. Envío bloqueado si hay errores

## 📋 Testing Manual

### Caso 1: Campos Vacíos
1. Borrar un campo numérico
2. ✓ Debe mostrar "Este campo es requerido"
3. ✓ Botón de envío debe estar deshabilitado

### Caso 2: Valores Fuera de Rango
1. Ingresar edad = 70 (máximo es 60)
2. ✓ Debe mostrar "Edad máxima: 60 años"
3. ✓ Botón de envío debe estar deshabilitado

### Caso 3: Valores No Enteros
1. Ingresar edad = 25.5 (debe ser entero)
2. ✓ Debe mostrar "La edad debe ser un número entero"
3. ✓ Botón de envío debe estar deshabilitado

### Caso 4: Demasiados Decimales
1. Ingresar semanas = 39.25 (máximo 1 decimal)
2. ✓ Debe mostrar "Máximo 1 decimal permitido"
3. ✓ Botón de envío debe estar deshabilitado

### Caso 5: Valores Válidos
1. Completar todos los campos con valores válidos
2. ✓ No debe haber mensajes de error
3. ✓ Botón de envío debe estar habilitado
4. ✓ Al enviar, debe llamar al API correctamente

## ✨ Mejoras Implementadas

### Experiencia de Usuario
- ✅ Los inputs usan estado string para permitir edición libre
- ✅ No se bloquea al usuario mientras escribe
- ✅ Validación solo se muestra después de interactuar con el campo
- ✅ Mensajes de error claros y en español
- ✅ Indicadores visuales (campos rojos cuando hay error)
- ✅ Alerta general con contador de errores

### Seguridad de Datos
- ✅ Prevención de envío con datos inválidos
- ✅ Validación de tipos (enteros vs decimales)
- ✅ Validación de rangos según especificaciones médicas
- ✅ Conversión correcta a formato API (boolean → 0/1)

### Mantenibilidad
- ✅ Código bien documentado
- ✅ Función `validateField()` centralizada y reutilizable
- ✅ TypeScript para type safety
- ✅ Lógica de validación desacoplada de la UI

## 🔗 Integración con API

Los datos validados se envían al API en el formato correcto:
```typescript
{
  edadMaterna: number,        // 15-60 (entero)
  paridad: number,            // 0-20 (entero)
  controlesPrenatales: number, // 0-20 (entero)
  semanasGestacion: number,   // 4.0-45.0 (decimal)
  hipertensionPrevia: 0 | 1,  // boolean → number
  diabetesGestacional: 0 | 1,
  cesareaPrevia: 0 | 1,
  embarazoMultiple: 0 | 1
}
```

La conversión de nombres (español ↔ inglés) y tipos (boolean ↔ 0/1) se maneja automáticamente en [src/services/api.ts](src/services/api.ts).
