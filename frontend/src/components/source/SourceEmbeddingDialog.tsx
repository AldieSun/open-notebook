'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSourceEmbedding } from '@/lib/hooks/use-source-embedding'
import { useModalManager } from '@/lib/hooks/use-modal-manager'
import { useTranslation } from '@/lib/hooks/use-translation'

interface SourceEmbeddingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  embeddingId: string
}

export function SourceEmbeddingDialog({ open, onOpenChange, embeddingId }: SourceEmbeddingDialogProps) {
  const { t } = useTranslation()
  const { openModal } = useModalManager()

  // Ensure embedding ID has 'source_embedding:' prefix for API calls
  const embeddingIdWithPrefix = embeddingId
    ? (embeddingId.includes(':') ? embeddingId : `source_embedding:${embeddingId}`)
    : ''

  const { data: embedding, isLoading } = useSourceEmbedding(embeddingIdWithPrefix, { enabled: open && !!embeddingId })

  const handleViewSource = () => {
    if (embedding?.source_id) {
      openModal('source', embedding.source_id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>{t.sources.citedPassage}</span>
            <div className="flex items-center gap-2">
              {embedding?.source_id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewSource}
                  className="gap-1"
                >
                  <FileText className="h-3 w-3" />
                  {t.sources.viewSource}
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm text-muted-foreground">{t.common.loading}</span>
            </div>
          ) : embedding ? (
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {embedding.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t.common.noResults}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
