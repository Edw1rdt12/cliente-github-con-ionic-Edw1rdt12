import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "./UserInfo";


const GITHUB_API_URL = import.meta.env.VITE_API_URL;
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
            headers: {
                Authorization: `token ${GITHUB_API_TOKEN}`,
            },
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
            },
        });

        type GitHubRepo = {
          name: string;
          description?: string | null;
          owner?: { avatar_url?: string; login?: string } | null;
          language?: string | null;
          stargazers_count?: number;
        };

        const data: GitHubRepo[] = response.data as GitHubRepo[];

        const repositories: RepositoryItem[] = data.map((repo) => ({
            name: repo.name,
            description: repo.description ?? null,
            imageUrl: repo.owner?.avatar_url ?? null,
            owner: repo.owner?.login ?? null,
            language: repo.language ?? null,
            stars: repo.stargazers_count ?? 0,
        }));

        return repositories;
    } catch (error) {
        console.error("Hubo un error al obtener los repositorios:", error);
        // En caso de error, devolvemos una lista vacía para que la UI maneje la ausencia de repositorios
        return [];
    }
}

export const createRepository = async (repo: { name: string; description?: string | null; private?: boolean }) => {
  const apiUrl = GITHUB_API_URL || 'https://api.github.com';
  const token = GITHUB_API_TOKEN;
  if (!token) throw new Error('GITHUB API token is missing. Set VITE_GITHUB_API_TOKEN in your .env file');

  const body = {
    name: repo.name,
    description: repo.description ?? undefined,
    private: repo.private ?? false,
    auto_init: true,
  };

  try {
    const response = await axios.post(`${apiUrl}/user/repos`, body, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });

    // Return minimal created repo info normalized to RepositoryItem
    const created = response.data;
    return {
      name: created.name,
      description: created.description ?? null,
      imageUrl: created.owner?.avatar_url ?? null,
      owner: created.owner?.login ?? null,
      language: created.language ?? null,
      stars: created.stargazers_count ?? 0,
    } as RepositoryItem;
  } catch (err: unknown) {
    // Extract message from axios error shape if possible
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message ?? err.message;
      // Log more context for debugging
      console.error('Error creating repository:', msg, { body, status: err.response?.status });
      throw new Error(msg);
    }
    // Normalize other errors
    console.error('Unexpected error creating repository:', err);
    throw new Error(String(err));
  }
};

export const fetchUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
        Accept: 'application/vnd.github+json'
      }
    });

    const data = response.data;

    const userInfo: UserInfo = {
      login: data.login ?? 'undefined',
      name: data.name ?? null,
      bio: data.bio ?? null,
      avatarUrl: data.avatar_url ?? null,
    };

    return userInfo;
  } catch (error) {
    console.error('Hubo un problema al obtener la información del usuario', error);
    console.log('Obteniendo información del usuario');
    const userInfo: UserInfo = {
      login: 'undefined',
      name: 'undefined',
      bio: 'undefined',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSapkvUI10mQkuGldkzyiR8BotPpuete58YQ&s',
    };

    return userInfo;
  }
};

// backward-compatible export: some files import `getUserInfo`
export const getUserInfo = fetchUserInfo;