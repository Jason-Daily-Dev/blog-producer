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


class BlogRequest(BaseModel):
    content_prompt: str
    style: str = "html"  # "html" is the default format


@app.post("/generate-blog")
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
