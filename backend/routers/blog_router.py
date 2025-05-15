from blog_generator import BlogGenerator
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel


class BlogRequest(BaseModel):
    content_prompt: str
    style: str = "html"  # "html" is the default format


router = APIRouter(tags=["blog"])


@router.post("/generate-blog")
async def generate_blog(request: BlogRequest):
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
