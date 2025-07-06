import logging
from typing import Annotated, List, Optional

from auth.auth import require_scope, verify_token
from blog_generator import BlogGenerator
from config import Settings, get_settings
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from search_photo import PhotoSearcher


class BlogRequest(BaseModel):
    content_prompt: str
    languages: Optional[List[str]] = ["english"]  # Default to English only


class BlogResponse(BaseModel):
    content: dict[str, str]
    background_image: Optional[str]
    format: str
    languages: List[str]


# Dependency to provide a PhotoSearcher instance, configured with API keys.
def get_photo_searcher(
    settings: Annotated[Settings, Depends(get_settings)],
) -> PhotoSearcher:
    return PhotoSearcher(
        pexels_api_key=settings.PEXELS_API_KEY,
        unsplash_access_key=settings.UNSPLASH_ACCESS_KEY,
    )


# Dependency to provide a BlogGenerator instance.
def get_blog_generator(
    settings: Annotated[Settings, Depends(get_settings)],
    photo_searcher: Annotated[PhotoSearcher, Depends(get_photo_searcher)],
) -> BlogGenerator:
    return BlogGenerator(
        openai_api_key=settings.OPENAI_API_KEY, photo_searcher=photo_searcher
    )


router = APIRouter(tags=["blog"], dependencies=[Depends(verify_token)])


@router.post("/generate-blog", response_model=BlogResponse)
async def generate_blog(
    request: BlogRequest,
    blog_generator: Annotated[BlogGenerator, Depends(get_blog_generator)],
    _: Annotated[None, Depends(require_scope("write:blog"))],
) -> BlogResponse:
    try:
        # If the languages list is not provided or is empty, default to English.
        # This logic is more explicit and prevents bugs where an empty list is passed.
        languages = request.languages
        if not languages:
            languages = ["english"]

        # Add logging to help you debug which languages are being processed.
        # You can check your server logs for this output.
        logging.info(f"Request to generate blog for languages: {languages}")

        # Generate blog content
        (
            content_dict,
            content_format,
            background_image,
        ) = await blog_generator.generate_blog(request.content_prompt, languages)

        if not content_dict:
            raise Exception("Failed to generate blog content.")

        return BlogResponse(
            content=content_dict,
            background_image=background_image,
            format=content_format,
            languages=languages,
        )

    except Exception:
        # Log the full exception for debugging purposes
        logging.exception("An error occurred while generating blog content.")
        # Return a generic error message to the client for security
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
