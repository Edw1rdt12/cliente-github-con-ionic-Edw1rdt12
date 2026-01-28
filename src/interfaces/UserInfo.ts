// Información del usuario proveniente de la API de GitHub
// Incluye campos útiles para mostrar en la UI y para la defensa técnica
export interface UserInfo {
  login: string;
  name?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
  location?: string | null;
} 
