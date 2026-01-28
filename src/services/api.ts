import axios, { AxiosInstance, AxiosError } from 'axios';

// Instancia Axios configurada para la API de GitHub
// - Añade token de autenticación a las cabeceras cuando está disponible
// - Normaliza errores para que la capa de UI pueda mostrarlos al usuario
// - Tiempo de espera razonable para evitar colgar la UI
const GITHUB_API_BASE = 'https://api.github.com';

import AuthService from './AuthService';

// Devuelve el token actual (si existe) desde AuthService
function getToken(): string | null {
  try {
    // Se usa AuthService como fuente única de verdad para el token
    return AuthService.getToken();
  } catch {
    return null;
  }
} 

const api: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

// Adjunta automáticamente el token a las cabeceras (la variable de entorno tiene prioridad)
// Nota: GitHub espera "token <PAT>" para autenticación con token personal
api.interceptors.request.use((config) => {
  const env = import.meta.env as Record<string, string | undefined>;
  const envToken = env.VITE_GITHUB_API_TOKEN;
  const token = envToken ?? getToken();
  if (token) {
    config.headers = config.headers ?? {};
    // GitHub espera "token <token>" para auth con PAT
    (config.headers as Record<string, string>)['Authorization'] = `token ${token}`;
  }
  return config;
});


// Manejo de respuestas y normalización de errores
// Las capas superiores reciben un Error con `message` y `status` opcional para mostrar en UI
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Normalizar errores para facilitar el manejo en UI
    const status = error.response?.status;
    const data = error.response?.data as unknown;

    const extractMessage = (d: unknown): string | undefined => {
      if (d && typeof d === 'object') {
        const obj = d as Record<string, unknown>;
        const m = obj['message'];
        if (typeof m === 'string') return m;
      }
      return undefined;
    };

    const message = extractMessage(data) ?? error.message;
    const err = new Error(message) as Error & { status?: number; original?: AxiosError };
    err.status = status;
    err.original = error;
    return Promise.reject(err);
  }
);

export default api;
