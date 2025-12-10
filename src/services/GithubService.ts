import axios from "axios";
import { RepositoryItem } from "../Interfaces/RepositoryItem";


const GITHUB_API_URL = "https://api.github.com";
const GITHUB_API_TOKEN = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Reemplaza con tu token de GitHub

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

        const repositories: RepositoryItem[] = response.data.map((repo: any) => ({
            name: repo.name,
            description: repo.description ? repo.description : null,
            imageurl: repo.owner.avatar_url ? repo.owner.avatar_url : null,
            owner: repo.owner.login ? repo.owner.login : null,
            lenguaje: repo.language ? repo.language : null,
        }));

        return repositories;
    } catch (error) {
        console.error("Hubo un error al obtener el repositorio:", error);
        return [];
    }
}