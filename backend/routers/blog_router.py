import os

from auth.auth import get_auth
from blog_generator import BlogGenerator
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Security
from fastapi_auth0 import Auth0User
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Get Auth0 instance
auth = get_auth()


class BlogRequest(BaseModel):
    content_prompt: str
    style: str = "html"  # "html" is the default format


router = APIRouter(tags=["blog"], dependencies=[Depends(auth.implicit_scheme)])


@router.get("/check-user")
async def check_user(
    request: Request, user: Auth0User = Security(auth.get_user, scopes=["write:blog"])
):
    return {"message": f"Hello, {user}"}


@router.post("/generate-blog")
async def generate_blog(
    request: BlogRequest,
    user: Auth0User = Security(auth.get_user, scopes=["write:blog"]),
):
    try:
        # Extract fields from the request
        content_prompt = request.content_prompt

        # Initialize BlogGenerator
        blog_generator = BlogGenerator()

        # Generate blog content
        blog_content, relevant_style, relevant_image_url = (
            await blog_generator.generate_blog(content_prompt)
        )

        return {
            "content": blog_content,
            "image_url": relevant_image_url,
            "format": relevant_style,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
