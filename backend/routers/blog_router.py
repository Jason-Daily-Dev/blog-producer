import logging
from typing import List, Optional

from auth.auth import require_scope, verify_token
from blog_generator import BlogGenerator
from config import Settings, get_settings
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from search_photo import PhotoSearcher


class BlogRequest(BaseModel):
    content_prompt: str
    languages: Optional[List[str]] = ["english"]  # Default to English only


# Dependency to provide a PhotoSearcher instance, configured with API keys.
def get_photo_searcher(settings: Settings = Depends(get_settings)):
    return PhotoSearcher(
        pexels_api_key=settings.PEXELS_API_KEY,
        unsplash_access_key=settings.UNSPLASH_ACCESS_KEY,
    )


# Dependency to provide a BlogGenerator instance.
def get_blog_generator(
    settings: Settings = Depends(get_settings),
    photo_searcher: PhotoSearcher = Depends(get_photo_searcher),
):
    return BlogGenerator(
        openai_api_key=settings.OPENAI_API_KEY, photo_searcher=photo_searcher
    )


router = APIRouter(tags=["blog"], dependencies=[Depends(verify_token)])


@router.post("/generate-blog")
async def generate_blog(
    request: BlogRequest,
    blog_generator: BlogGenerator = Depends(get_blog_generator),
    _=Depends(require_scope("write:blog")),
):
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

        return {
            "content": content_dict,
            "background_image": background_image,
            "format": content_format,
            "languages": languages,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
