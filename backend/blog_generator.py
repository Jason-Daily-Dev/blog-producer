import os

import openai
from agents import Agent, Runner
from dotenv import load_dotenv
from search_photo import PhotoSearcher

load_dotenv()


class BlogGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.openai_api_key
        self.photo_searcher = PhotoSearcher()

    async def generate_blog(self, prompt: str):
        agent_instructions = (
            "You are a professional blog writer. Given a prompt and optional images, generate a well-structured blog post. "
            "If images are provided, include them in the appropriate places with descriptive captions. Format the output in Markdown with proper headings, paragraphs, and lists."
        )

        user_input = f"Prompt: {prompt}"

        agent = Agent(name="BlogWriter", instructions=agent_instructions)
        result = await Runner.run(agent, user_input)

        blog_content = result.final_output

        return blog_content
