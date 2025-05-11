import base64
import os
from typing import List, Optional

from blog_generator import BlogGenerator
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
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
    prompt: str
    images: List[str]  # Base64 encoded images


@app.post("/generate-blog")
async def generate_blog(
    content_prompt: str = Form(...),
    image_prompt: str = Form(None),
    images: Optional[List[UploadFile]] = [],
):
    try:
        # Convert images to base64 if provided
        image_descriptions = []
        if images:
            for image in images:
                if not isinstance(image, UploadFile):
                    raise HTTPException(
                        status_code=400, detail="Invalid file format for images"
                    )
                image_content = await image.read()
                image_base64 = base64.b64encode(image_content).decode("utf-8")
                image_descriptions.append(f"![]({image_base64})")

        # Initialize BlogGenerator
        blog_generator = BlogGenerator()

        # Generate blog content
        blog_content, relevant_image_url = await blog_generator.generate_blog(
            content_prompt, image_descriptions
        )

        # If no images are provided, use the image_prompt to search for a relevant image
        if not images and image_prompt:
            relevant_image_url = blog_generator.photo_searcher.search_photo(
                image_prompt
            )

        return {
            "content": blog_content,
            "image_url": relevant_image_url,
            "format": "markdown",
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
