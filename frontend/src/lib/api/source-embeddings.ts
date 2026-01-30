import apiClient from './client'

export interface SourceEmbeddingResponse {
  id: string
  source_id: string
  content: string
  created: string
  updated: string
}

export const sourceEmbeddingsApi = {
  get: async (embeddingId: string) => {
    const response = await apiClient.get<SourceEmbeddingResponse>(`/source-embeddings/${embeddingId}`)
    return response.data
  }
}
