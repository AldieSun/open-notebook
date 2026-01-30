import { useQuery } from '@tanstack/react-query'
import { sourceEmbeddingsApi } from '@/lib/api/source-embeddings'

export function useSourceEmbedding(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['source-embeddings', id],
    queryFn: () => sourceEmbeddingsApi.get(id),
    enabled: options?.enabled !== false && !!id,
    staleTime: 30 * 1000, // 30 seconds
  })
}
