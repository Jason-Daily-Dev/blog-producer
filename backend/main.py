import base64
import os
from typing import List, Optional

from blog_generator import BlogGenerator
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BlogContent(BaseModel):
    content: str
    format: str  # "markdown" or "html"


class BlogRequest(BaseModel):
    content_prompt: str
    image_prompt: Optional[str] = None


@app.post("/generate-blog")
async def generate_blog(request: BlogRequest):
    try:
        # Extract fields from the request
        content_prompt = request.content_prompt
        image_prompt = request.image_prompt

        # Initialize BlogGenerator
        blog_generator = BlogGenerator()

        # Generate blog content
        blog_content = await blog_generator.generate_blog(content_prompt)

        # If no images are provided, use the image_prompt to search for a relevant image
        if image_prompt:
            relevant_image_url = blog_generator.photo_searcher.search_photo(
                image_prompt
            )
        else:
            relevant_image_url = None

        return {
            "content": blog_content,
            "image_url": relevant_image_url,
            "format": "markdown",
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
