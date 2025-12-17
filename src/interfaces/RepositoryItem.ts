export interface RepositoryItem {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  owner?: string | null;
  language?: string | null;
  stars?: number;
}