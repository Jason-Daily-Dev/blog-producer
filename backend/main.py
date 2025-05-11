import base64
import os
from typing import List, Optional

import openai
from agents import Agent, Runner
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

        # Create agent and run it
        agent = Agent(
            name="BlogWriter",
            instructions="You are a professional blog writer. Given a prompt and optional images, generate a well-structured blog post. If images are provided, include them in the appropriate places with descriptive captions. Format the output in Markdown with proper headings, paragraphs, and lists.",
        )

        user_input = f"Prompt: {prompt}"
        if image_descriptions:
            user_input += f"\nImages: {', '.join(image_descriptions)}"

        result = await Runner.run(agent, user_input)

        return {"content": result.final_output, "format": "markdown"}

    except HTTPException as e:
        raise e
    except Exception as e:
        return {"error": str(e)}
