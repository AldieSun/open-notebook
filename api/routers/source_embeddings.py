from fastapi import APIRouter, HTTPException
from loguru import logger

from api.models import SourceEmbeddingResponse
from open_notebook.domain.notebook import SourceEmbedding

router = APIRouter()


@router.get("/source-embeddings/{embedding_id}", response_model=SourceEmbeddingResponse)
async def get_embedding(embedding_id: str):
    """Get a specific source embedding (text chunk) by ID."""
    try:
        embedding = await SourceEmbedding.get(embedding_id)
        if not embedding:
            raise HTTPException(status_code=404, detail="Embedding not found")

        # Get source ID from the embedding relationship
        source = await embedding.get_source()

        return SourceEmbeddingResponse(
            id=embedding.id or "",
            source_id=source.id or "",
            content=embedding.content,
            created=str(embedding.created),
            updated=str(embedding.updated),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching embedding {embedding_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching embedding")
