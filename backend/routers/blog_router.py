import logging
from typing import List, Optional

from auth.auth import get_auth
from blog_generator import BlogGenerator
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi_auth0 import Auth0User
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Get Auth0 instance
auth = get_auth()


class BlogRequest(BaseModel):
    content_prompt: str
    languages: Optional[List[str]] = ["english"]  # Default to English only


router = APIRouter(tags=["blog"], dependencies=[Depends(auth.implicit_scheme)])


@router.post("/generate-blog")
async def generate_blog(
    request: BlogRequest,
    user: Auth0User = Security(auth.get_user, scopes=["write:blog"]),
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

        # Initialize BlogGenerator
        blog_generator = BlogGenerator()

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
