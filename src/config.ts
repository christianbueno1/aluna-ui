/**
 * Configuración de la aplicación Aluna UI
 * 
 * Esta configuración contiene valores públicos y no sensibles.
 * Para valores que varían por entorno, usar variables de entorno.
 */

export const config = {
  /**
   * URL base del API de Aluna
   * Sistema de predicción de riesgos obstétricos
   */
  apiBaseUrl: 'https://aluna-api.deployhero.dev',
  
  /**
   * Información de la aplicación
   */
  app: {
    name: 'Aluna UI',
    version: '1.0.0',
    description: 'Sistema de predicción de riesgos obstétricos',
  },
} as const;
