from auth.auth import get_auth
from blog_generator import BlogGenerator
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi_auth0 import Auth0User
from pydantic import BaseModel
from typing import List, Optional

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
        # Extract fields from the request
        content_prompt = request.content_prompt
        languages = request.languages or ["english"]

        # Initialize BlogGenerator
        blog_generator = BlogGenerator()

        # Generate blog content
        (
            content_dict,
            content_format,
            background_image,
        ) = await blog_generator.generate_blog(content_prompt, languages)

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
