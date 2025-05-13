import ast
import json
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
            "You are a professional blog writer. Given a prompt, generate a well-structured blog post. "
            "If the prompt explicitly mentions 'markdown', format the blog content in Markdown. Otherwise, use HTML as the default format. "
            "Output: Return a raw Python dictionary with the following keys (do not wrap it in Markdown or any other formatting): \n"
            "- 'blog_content': The generated blog post as a string.\n"
            "- 'style': The writing style used, either 'html' or 'markdown'."
        )

        user_input = f"Prompt: {prompt}"

        agent = Agent(name="BlogWriter", instructions=agent_instructions)
        result = await Runner.run(agent, user_input)

        final_output = result.final_output

        # Safely evaluate the Python dictionary string
        final_output = ast.literal_eval(final_output)

        blog_content = final_output["blog_content"]
        style = final_output["style"]

        return blog_content, style
