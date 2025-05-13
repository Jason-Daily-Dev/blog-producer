import ast
import os

import openai
from agents import Agent, Runner, function_tool
from dotenv import load_dotenv
from search_photo import PhotoSearcher

load_dotenv()


@function_tool
def search_photo_tool(keywords: str) -> str:
    """
    Search for the most relevant photo based on the given keywords.

    Args:
        keywords (str): Keywords to search for the photo.

    Returns:
        str: URL of the most relevant photo.
    """
    photo_searcher = PhotoSearcher()
    return photo_searcher.search_photo(keywords)


class BlogGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.openai_api_key

    async def generate_blog(self, prompt: str):
        agent_instructions = (
            "You are a professional blog writer and image researcher. Given a prompt, generate a well-structured blog post. "
            "If the prompt explicitly mentions 'markdown', format the blog content in Markdown. Otherwise, use HTML as the default format. "
            "Analyze the prompt to extract the most relevant keywords for image search. "
            "Use the `search_photo_tool` to find the most relevant image based on the extracted keywords. "
            "Output: Return only a raw Python dictionary with the following keys (do not include any introductory text, explanations, or formatting): \n"
            "- 'blog_content': The generated blog post as a string.\n"
            "- 'style': The writing style used, either 'html' or 'markdown'.\n"
            "- 'image_url': The URL of the most relevant image found using the `search_photo_tool`.\n"
            'Example output: {"blog_content": "<h1>Title</h1><p>Content</p>", "style": "html", "image_url": "https://example.com/image.jpg"}'
        )

        user_input = f"Prompt: {prompt}"

        agent = Agent(
            name="BlogWriter",
            instructions=agent_instructions,
            tools=[search_photo_tool],
        )
        result = await Runner.run(agent, user_input)

        final_output = result.final_output

        # Safely evaluate the Python dictionary string
        final_output = ast.literal_eval(final_output)

        blog_content = final_output["blog_content"]
        style = final_output["style"]
        image_url = final_output.get("image_url", None)

        return blog_content, style, image_url
