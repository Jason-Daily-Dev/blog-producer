import base64
import os
from typing import List, Optional

import openai
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

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")


class BlogContent(BaseModel):
    content: str
    format: str  # "markdown" or "html"


class BlogRequest(BaseModel):
    prompt: str
    images: List[str]  # Base64 encoded images


@app.post("/generate-blog")
async def generate_blog(
    prompt: str = Form(...), images: Optional[List[UploadFile]] = File(None)
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
        blog_content = await blog_generator.generate_blog(prompt, image_descriptions)

        return {"content": blog_content, "format": "markdown"}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
