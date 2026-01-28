// Servicios para comunicarse con la API de GitHub
// Proveen funciones reutilizables para la capa de UI: obtener repos, info de usuario y operaciones CRUD
import axios from 'axios';
import AuthService from './AuthService';
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
// Instancia axios específica para este servicio con políticas de cache-desactivado
const GITHUB_API_URL = 'https://api.github.com';
const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/vnd.github+json',
    }
});

// Adjuntar token de AuthService (si existe) a cada petición
githubApi.interceptors.request.use((config) => {
    try {
        const env = import.meta.env as Record<string, string | undefined>;
        const envToken = env.VITE_GITHUB_API_TOKEN;
        // proteger acceso a AuthService en caso de que no esté disponible por alguna razón
        const token = envToken ?? (typeof AuthService !== 'undefined' && AuthService.getToken ? AuthService.getToken() : null);
        if (token) {
            config.headers = config.headers ?? {};
            (config.headers as Record<string, string>)['Authorization'] = `token ${token}`;
        }

        // Añadir parámetro anti-cache a GET para evitar usar cabeceras no-safelisted
        const method = (config.method ?? '').toString().toLowerCase();
        if (method === 'get') {
            config.params = {
                ...(config.params ?? {}),
                _ts: Date.now(),
            };
        }
    } catch (e) {
        // no romper la request si ocurre algo inesperado al obtener el token
        console.warn('GithubService: no se pudo adjuntar token en interceptor', e);
    }
    return config;
});


// --- Obtener Repositorios ---
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    // Verificar que exista un token disponible (variable de entorno o AuthService)
    // Si no hay token, se solicita iniciar sesión en la pantalla Login
    const token = import.meta.env.VITE_GITHUB_API_TOKEN ?? AuthService.getToken();
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
// Crea un repositorio usando la cuenta autenticada (POST /user/repos)
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

// --- Obtener Info del Usuario ---
// Llama a GET /user para recuperar datos del usuario autenticado
// Mapea campos adicionales (followers, following, public_repos) para la UI
export const getUserInfo = async () : Promise<UserInfo | null> => {
    try {
        const response = await githubApi.get('/user');
        
        // Mapear y retornar la data exitosa
        const userData: UserInfo = {
            login: response.data.login,
            name: response.data.name ?? null,
            bio: response.data.bio ?? null,
            avatarUrl: response.data.avatar_url ?? null,
            followers: typeof response.data.followers === 'number' ? response.data.followers : 0,
            following: typeof response.data.following === 'number' ? response.data.following : 0,
            public_repos: typeof response.data.public_repos === 'number' ? response.data.public_repos : 0,
            location: response.data.location ?? null,
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
            followers: 0,
            following: 0,
            public_repos: 0,
            location: null,
        };

        return userNotFound;
    }
};

// --- Eliminar Repositorio ---
// Ejecuta DELETE /repos/:owner/:repo. Requiere permisos del token.
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

            if (status === 404) {
                // GitHub suele devolver 404 para recursos no encontrados o cuando el token no tiene permiso
                throw new Error(`Repositorio ${owner}/${name} no encontrado (404). Comprueba que el nombre es correcto y que tu token tiene permisos (scope 'repo') para eliminarlo.`);
            }

            if (status === 403) {
                throw new Error(data?.message ?? `Acceso denegado (403) al eliminar ${owner}/${name}. Verifica que tu token tenga permisos adecuados (scope 'repo').`);
            }

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

            if (status === 404) {
                throw new Error(`Repositorio ${owner}/${repoName} no encontrado (404). Comprueba que el nombre y el propietario sean correctos y que tu token tenga permisos (scope 'repo').`);
            }

            if (status === 403) {
                throw new Error(data?.message ?? `Acceso denegado (403) al editar ${owner}/${repoName}. Verifica que tu token tenga permisos adecuados (scope 'repo').`);
            }

            if (status === 422) throw new Error(data?.message ?? 'Validación fallida al editar repositorio');
            throw new Error(data?.message ?? errorAny?.message ?? 'Error al editar repositorio');
        } catch (parseErr) {
            const fallback = parseErr instanceof Error ? parseErr.message : String(parseErr);
            throw new Error(fallback || 'Error al editar repositorio');
        }
    }
};