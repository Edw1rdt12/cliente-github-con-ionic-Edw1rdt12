import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../services/UserInfo";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;
const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
    // Prefer environment token, fallback to token stored in localStorage by AuthService
    const authHeader = import.meta.env.VITE_GITHUB_API_TOKEN ?? localStorage.getItem('github_auth_token');
    if (authHeader) {
        config.headers = config.headers ?? {};
        // GitHub accepts `token <token>` or `Bearer <token>`; using `token` here
        config.headers.Authorization = `token ${authHeader}`;
    }
    return config;
});

// --- Obtener Repositorios ---
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    // Verificar que exista un token disponible (env o localStorage)
    const token = import.meta.env.VITE_GITHUB_API_TOKEN ?? localStorage.getItem('github_auth_token');
    if (!token) {
        throw new Error('No hay token de GitHub. Por favor inicia sesión en la pantalla de Login.');
    }

    try {
        type GHRepo = {
            name: string;
            description?: string | null;
            owner?: { avatar_url?: string; login?: string } | null;
            language?: string | null;
        };
        const response = await githubApi.get('/user/repos', {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
            }
        });

        // Inspect raw response data to handle different possible shapes
        const raw = response.data;
        // DEBUG: mostrar la forma real de la respuesta para facilitar diagnóstico
        console.debug('fetchRepositories response.data:', raw);

        // Normalizar: buscar un array en distintos lugares comunes
        let list: any[] | null = null;
        if (Array.isArray(raw)) list = raw;
        else if (raw && Array.isArray(raw.items)) list = raw.items;
        else if (raw && Array.isArray(raw.data)) list = raw.data;

        if (!list) {
            // No es el arreglo esperado — lanzar error con info útil
            throw new Error(`Formato inesperado de respuesta al obtener repositorios: ${JSON.stringify(raw)}`);
        }

        const repositories: RepositoryItem[] = list.map((repo: any) => ({
            name: repo.name,
            description: repo.description || null,
            imageUrl: repo.owner ? repo.owner.avatar_url : null,
            owner: repo.owner ? repo.owner.login : null,
            language: repo.language || null,
        }));

        return repositories;

    } catch (err) {
        console.error("Hubo un problema al obtener los repositorios", err);
        // Intentar extraer información útil desde la respuesta de Axios
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorAny: any = err;
            const status = errorAny?.response?.status;
            const data = errorAny?.response?.data;

            if (status === 401) {
                throw new Error('No autorizado (401). Token inválido o sin permisos. Inicia sesión nuevamente.');
            }
            if (status === 403) {
                // Podría ser rate limit u otro bloqueo
                const msg = data?.message ?? 'Acceso denegado (403). Posible límite de tasa o permisos.';
                throw new Error(msg);
            }

            throw new Error(data?.message ?? errorAny?.message ?? 'Error al obtener repositorios');
        } catch (parseErr) {
            const fallback = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(fallback || 'Error al obtener repositorios');
        }
    }
};

// --- Crear Repositorio ---
export const createRepository = async (params: { name: string; description?: string | null; private?: boolean; }): Promise<RepositoryItem> => {
    // Validación local: GitHub no permite espacios en el nombre y acepta letras, números, guiones, guiones bajos y puntos
    const NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
    if (!NAME_REGEX.test(params.name)) {
        throw new Error('Nombre inválido: usa sólo letras, números, guiones (-), guiones bajos (_) o puntos (.)');
    }

    try {
        const payload = {
            name: params.name,
            description: params.description ?? undefined,
            private: params.private ?? false,
        };
        console.debug('createRepository payload:', payload);

        const response = await githubApi.post('/user/repos', payload);

        // Mapear respuesta a RepositoryItem para uso en UI
        const data = response.data;
        const created: RepositoryItem = {
            name: data.name,
            description: data.description ?? null,
            imageUrl: data.owner?.avatar_url ?? null,
            owner: data.owner?.login ?? null,
            language: data.language ?? null,
            stars: data.stargazers_count ?? 0,
        };

        return created;
    } catch (err) {
        console.error("Hubo un problema al crear el repositorio", err);
        // Intentar extraer info más útil si vino de GitHub
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorAny: any = err;
            const status = errorAny?.response?.status;
            const data = errorAny?.response?.data;

            if (status === 422) {
                // GitHub suele devolver un objeto con `message` y `errors` describiendo el problema
                let details = data?.message ?? 'Validación fallida (422).';
                if (Array.isArray(data?.errors) && data.errors.length > 0) {
                    const parts = data.errors.map((e: { message?: string; resource?: string; code?: string }) => e.message ?? `${e.resource ?? ''} ${e.code ?? ''}`);
                    details = `${details} (${parts.join('; ')})`;
                }

                const lowered = (details || '').toLowerCase();
                if (lowered.includes('name already exists') || lowered.includes('name has already been taken') || lowered.includes('already_exists') || lowered.includes('name is already in use')) {
                    throw new Error('El nombre ya existe en tu cuenta. Elige otro nombre.');
                }

                throw new Error(details);
            }

            if (status === 401) {
                throw new Error('No autorizado (401). Token inválido o sin permisos. Inicia sesión nuevamente.');
            }
            if (status === 403) {
                throw new Error(data?.message ?? 'Acceso denegado (403). Posible límite de tasa o permisos.');
            }

            const msg = data?.message ?? errorAny.message ?? String(errorAny);
            throw new Error(msg || 'Error al crear el repositorio');
        } catch (parseErr) {
            // Fallback
            const fallback = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(fallback || 'Error al crear el repositorio');
        }
    }
};

// --- Obtener Info del Usuario (Corregido) ---
export const getUserInfo = async () : Promise<UserInfo | null> => {
    try {
        const response = await githubApi.get('/user');
        
        // Mapear y retornar la data exitosa
        const userData: UserInfo = {
            login: response.data.login,
            name: response.data.name,
            bio: response.data.bio,
            avatarUrl: response.data.avatar_url
        };

        return userData;
      
    } catch (error) {
        console.error("Hubo un problema al obtener la información del usuario", error);
        
        const userNotFound: UserInfo = {
            login: 'undefined',
            name: 'undefined',
            bio: 'undefined',
            // Usar un placeholder real
            avatarUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', 
        };

        return userNotFound;
    }
};

// --- Eliminar Repositorio ---
export const deleteRepository = async (owner: string, name: string): Promise<void> => {
    try {
        await githubApi.delete(`/repos/${owner}/${name}`);
    } catch (err) {
        console.error('Error borrando repositorio', err);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorAny: any = err;
            const status = errorAny?.response?.status;
            const data = errorAny?.response?.data;
            if (status === 404) throw new Error('Repositorio no encontrado (404).');
            if (status === 403) throw new Error(data?.message ?? 'Acceso denegado (403) al eliminar repositorio.');
            throw new Error(data?.message ?? errorAny?.message ?? 'Error al eliminar repositorio');
        } catch (parseErr) {
            const fallback = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(fallback || 'Error al eliminar repositorio');
        }
    }
};

// --- Editar Repositorio ---
export const editRepository = async (owner: string, repoName: string, params: { name?: string; description?: string | null; private?: boolean; }): Promise<RepositoryItem> => {
    try {
        const body: { name?: string; description?: string | null; private?: boolean } = {};
        if (params.name) body.name = params.name;
        if (params.description !== undefined) body.description = params.description;
        if (params.private !== undefined) body.private = params.private;

        const response = await githubApi.patch(`/repos/${owner}/${repoName}`, body);
        const data = response.data;
        const updated: RepositoryItem = {
            name: data.name,
            description: data.description ?? null,
            imageUrl: data.owner?.avatar_url ?? null,
            owner: data.owner?.login ?? null,
            language: data.language ?? null,
            stars: data.stargazers_count ?? 0,
        };
        return updated;
    } catch (err) {
        console.error('Error editando repositorio', err);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorAny: any = err;
            const status = errorAny?.response?.status;
            const data = errorAny?.response?.data;
            if (status === 404) throw new Error('Repositorio no encontrado (404).');
            if (status === 403) throw new Error(data?.message ?? 'Acceso denegado (403) al editar repositorio.');
            if (status === 422) throw new Error(data?.message ?? 'Validación fallida al editar repositorio');
            throw new Error(data?.message ?? errorAny?.message ?? 'Error al editar repositorio');
        } catch (parseErr) {
            const fallback = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(fallback || 'Error al editar repositorio');
        }
    }
};