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
    style: str = "html"  # "html" is the default format


router = APIRouter(tags=["blog"], dependencies=[Depends(auth.implicit_scheme)])


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
        (
            blog_content,
            relevant_style,
            background_image,
        ) = await blog_generator.generate_blog(content_prompt)

        return {
            "content": blog_content,
            "background_image": background_image,
            "format": relevant_style,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
