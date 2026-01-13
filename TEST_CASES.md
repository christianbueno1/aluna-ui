# Casos de Prueba - Validación de Formulario

## 🧪 Pruebas Manuales Recomendadas

### Test Suite 1: Validación de Campos Vacíos

#### Test 1.1: Campo Edad Vacío
```
Pasos:
1. Abrir formulario
2. Borrar el valor de "Edad Materna"
3. Hacer clic fuera del campo (blur)

Resultado Esperado:
✓ Mensaje: "Este campo es requerido"
✓ Campo con borde rojo
✓ Alerta superior: "Hay 1 campo con error..."
✓ Botón "Evaluar Riesgos" deshabilitado
```

#### Test 1.2: Múltiples Campos Vacíos
```
Pasos:
1. Borrar Edad Materna, Paridad y Controles
2. Hacer blur en cada campo

Resultado Esperado:
✓ 3 mensajes de error
✓ Alerta: "Hay 3 campos con errores..."
✓ Botón deshabilitado
```

---

### Test Suite 2: Validación de Tipos de Datos

#### Test 2.1: Edad con Decimales
```
Entrada: Edad Materna = 25.5

Resultado Esperado:
✓ Mensaje: "La edad debe ser un número entero"
✓ Botón deshabilitado
```

#### Test 2.2: Paridad con Decimales
```
Entrada: Paridad = 2.7

Resultado Esperado:
✓ Mensaje: "La paridad debe ser un número entero"
✓ Botón deshabilitado
```

#### Test 2.3: Controles con Decimales
```
Entrada: Controles Prenatales = 8.3

Resultado Esperado:
✓ Mensaje: "Los controles deben ser un número entero"
✓ Botón deshabilitado
```

#### Test 2.4: Semanas con Múltiples Decimales
```
Entrada: Semanas de Gestación = 39.25

Resultado Esperado:
✓ Mensaje: "Máximo 1 decimal permitido"
✓ Botón deshabilitado
```

#### Test 2.5: Semanas con 1 Decimal (VÁLIDO)
```
Entrada: Semanas de Gestación = 39.5

Resultado Esperado:
✓ Sin mensajes de error
✓ Campo con borde normal
```

---

### Test Suite 3: Validación de Rangos

#### Test 3.1: Edad Menor al Mínimo
```
Entrada: Edad Materna = 10

Resultado Esperado:
✓ Mensaje: "Edad mínima: 15 años"
✓ Botón deshabilitado
```

#### Test 3.2: Edad Mayor al Máximo
```
Entrada: Edad Materna = 65

Resultado Esperado:
✓ Mensaje: "Edad máxima: 60 años"
✓ Botón deshabilitado
```

#### Test 3.3: Paridad Negativa
```
Entrada: Paridad = -1

Resultado Esperado:
✓ Mensaje: "La paridad no puede ser negativa"
✓ Botón deshabilitado
```

#### Test 3.4: Paridad Mayor al Máximo
```
Entrada: Paridad = 25

Resultado Esperado:
✓ Mensaje: "Valor máximo: 20"
✓ Botón deshabilitado
```

#### Test 3.5: Controles Negativos
```
Entrada: Controles Prenatales = -5

Resultado Esperado:
✓ Mensaje: "Los controles no pueden ser negativos"
✓ Botón deshabilitado
```

#### Test 3.6: Controles Mayor al Máximo
```
Entrada: Controles Prenatales = 30

Resultado Esperado:
✓ Mensaje: "Valor máximo: 20"
✓ Botón deshabilitado
```

#### Test 3.7: Semanas Menor al Mínimo
```
Entrada: Semanas de Gestación = 2.0

Resultado Esperado:
✓ Mensaje: "Mínimo: 4.0 semanas"
✓ Botón deshabilitado
```

#### Test 3.8: Semanas Mayor al Máximo
```
Entrada: Semanas de Gestación = 50.0

Resultado Esperado:
✓ Mensaje: "Máximo: 45.0 semanas"
✓ Botón deshabilitado
```

---

### Test Suite 4: Validación en Tiempo Real

#### Test 4.1: Corrección de Error en Vivo
```
Pasos:
1. Ingresar Edad = 10 (error: menor al mínimo)
2. Ver mensaje de error
3. Cambiar a Edad = 25 (válido)

Resultado Esperado:
✓ Mensaje de error desaparece automáticamente
✓ Campo vuelve a borde normal
✓ Botón se habilita si no hay otros errores
```

#### Test 4.2: Validación Mientras se Escribe
```
Pasos:
1. Comenzar a escribir en Edad: "7" (inválido)
2. Continuar: "70" (inválido, mayor a 60)
3. Borrar último dígito: "7" (inválido, menor a 15)
4. Completar: "72" (inválido)
5. Borrar y escribir: "28" (válido)

Resultado Esperado:
✓ Errores se actualizan dinámicamente
✓ Solo se muestra error después del primer blur
✓ Error final desaparece cuando valor es válido
```

---

### Test Suite 5: Validación de Switches (Campos Booleanos)

#### Test 5.1: Toggle Hipertensión Previa
```
Pasos:
1. Activar switch "Hipertensión Previa"
2. Desactivar switch

Resultado Esperado:
✓ Switch cambia sin errores
✓ Valor se actualiza correctamente
✓ No afecta validación de otros campos
```

#### Test 5.2: Todos los Switches Activados
```
Pasos:
1. Activar los 4 switches:
   - Hipertensión Previa
   - Diabetes Gestacional
   - Cesárea Previa
   - Embarazo Múltiple

Resultado Esperado:
✓ Todos los switches funcionan correctamente
✓ No generan errores de validación
✓ Botón permanece habilitado (si campos numéricos son válidos)
```

---

### Test Suite 6: Validación Pre-Envío

#### Test 6.1: Intentar Envío con Errores
```
Pasos:
1. Llenar formulario con Edad = 10 (inválido)
2. Hacer clic en "Evaluar Riesgos"

Resultado Esperado:
✓ Botón está deshabilitado, no se puede hacer clic
✓ Formulario NO se envía
✓ Errores permanecen visibles
```

#### Test 6.2: Envío Exitoso
```
Pasos:
1. Llenar formulario con datos válidos:
   - Edad: 28
   - Paridad: 1
   - Controles: 8
   - Semanas: 39.0
2. Hacer clic en "Evaluar Riesgos"

Resultado Esperado:
✓ No hay mensajes de error
✓ Botón habilitado
✓ Formulario se envía al API
✓ Muestra estado de carga
✓ Recibe y muestra resultados
```

---

### Test Suite 7: Casos Límite (Edge Cases)

#### Test 7.1: Valores en el Límite Inferior (VÁLIDOS)
```
Datos:
- Edad: 15 (mínimo)
- Paridad: 0 (mínimo)
- Controles: 0 (mínimo)
- Semanas: 4.0 (mínimo)

Resultado Esperado:
✓ Sin errores
✓ Todos los campos válidos
✓ Botón habilitado
```

#### Test 7.2: Valores en el Límite Superior (VÁLIDOS)
```
Datos:
- Edad: 60 (máximo)
- Paridad: 20 (máximo)
- Controles: 20 (máximo)
- Semanas: 45.0 (máximo)

Resultado Esperado:
✓ Sin errores
✓ Todos los campos válidos
✓ Botón habilitado
```

#### Test 7.3: Semanas con .0 Decimal
```
Entrada: Semanas = 39.0

Resultado Esperado:
✓ Válido (se acepta .0)
✓ Sin errores
```

#### Test 7.4: Entrada de Texto No Numérico
```
Entrada: Edad = "abc"

Resultado Esperado:
✓ Mensaje: "Ingrese un número válido"
✓ Botón deshabilitado
```

---

### Test Suite 8: Experiencia de Usuario

#### Test 8.1: Contador de Errores
```
Pasos:
1. Introducir 3 errores diferentes
2. Observar alerta superior

Resultado Esperado:
✓ Alerta muestra: "Hay 3 campos con errores..."
✓ Icono de alerta visible
✓ Color rojo/destructivo
```

#### Test 8.2: Corrección Progresiva de Errores
```
Pasos:
1. Crear 3 errores
2. Corregir 1 error
3. Ver actualización de contador
4. Corregir 2do error
5. Corregir 3er error

Resultado Esperado:
✓ Contador: "3 campos" → "2 campos" → "1 campo"
✓ Alerta desaparece cuando todos se corrigen
✓ Botón se habilita al final
```

#### Test 8.3: Indicadores Visuales
```
Verificar que campos con error muestren:
✓ Borde rojo
✓ Mensaje de error debajo del campo
✓ Texto en color rojo
✓ Texto de ayuda (gris) permanece visible
```

---

## 🎯 Casos de Prueba de Integración

### Test INT-1: Flujo Completo - Paciente de Bajo Riesgo
```
Datos de Entrada:
- Edad: 28
- Paridad: 1
- Controles: 8
- Semanas: 39.0
- Hipertensión: No
- Diabetes: No
- Cesárea: No
- Embarazo Múltiple: No

Pasos:
1. Llenar formulario
2. Verificar que no hay errores
3. Hacer clic en "Evaluar Riesgos"
4. Esperar respuesta del API

Resultado Esperado:
✓ Formulario válido
✓ Se envía al API correctamente
✓ Recibe respuesta de predicción
✓ Muestra resultados (probablemente riesgo bajo)
```

### Test INT-2: Flujo Completo - Paciente de Alto Riesgo
```
Datos de Entrada:
- Edad: 42
- Paridad: 3
- Controles: 4
- Semanas: 37.5
- Hipertensión: Sí
- Diabetes: Sí
- Cesárea: Sí
- Embarazo Múltiple: No

Pasos:
1. Llenar formulario
2. Verificar que no hay errores
3. Hacer clic en "Evaluar Riesgos"
4. Esperar respuesta del API

Resultado Esperado:
✓ Formulario válido
✓ Se envía al API correctamente
✓ Recibe respuesta de predicción
✓ Muestra resultados (probablemente riesgo alto)
✓ Badges y alertas muestran código de colores correcto
```

---

## 📊 Matriz de Cobertura de Validación

| Campo               | Vacío | Tipo | Rango Mín | Rango Máx | Decimales | Negativo |
|---------------------|-------|------|-----------|-----------|-----------|----------|
| Edad Materna        | ✓     | ✓    | ✓         | ✓         | ✓         | N/A      |
| Paridad             | ✓     | ✓    | N/A       | ✓         | ✓         | ✓        |
| Controles           | ✓     | ✓    | N/A       | ✓         | ✓         | ✓        |
| Semanas Gestación   | ✓     | N/A  | ✓         | ✓         | ✓         | N/A      |
| Switches (4)        | N/A   | N/A  | N/A       | N/A       | N/A       | N/A      |

**Leyenda**: ✓ = Validación implementada | N/A = No aplica

---

## ✅ Checklist de Validación Completa

- [x] Campos numéricos no pueden estar vacíos
- [x] Edad, Paridad y Controles deben ser enteros
- [x] Semanas puede tener máximo 1 decimal
- [x] Todos los campos tienen rangos validados
- [x] Valores negativos rechazados donde corresponde
- [x] Mensajes de error específicos por tipo de error
- [x] Validación en tiempo real mientras se escribe
- [x] Errores solo se muestran después de "touch"
- [x] Errores desaparecen al corregir
- [x] Botón de envío se deshabilita con errores
- [x] Alerta general con contador de errores
- [x] Indicadores visuales (bordes rojos)
- [x] Validación pre-envío
- [x] Conversión correcta al formato API
- [x] Switches funcionan sin restricciones
