import ast
import os

import openai
from agents import Agent, Runner, function_tool
from dotenv import load_dotenv
from search_photo import PhotoSearcher

load_dotenv()


@function_tool
def search_photo_tool(keywords: str, count: int = 4) -> list[str]:
    """
    Search for the most relevant photos based on the given keywords.

    Args:
        keywords (str): Keywords to search for the photos.
        count (int): Number of photos to return (default is 4).

    Returns:
        list[str]: List of image URLs.
    """
    photo_searcher = PhotoSearcher()
    return photo_searcher.search_photos(keywords, count)


class BlogGenerator:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.openai_api_key

    async def generate_blog(self, prompt: str) -> tuple[str, str, str | None]:
        agent_instructions = (
            "You are a professional blog writer and wildlife content specialist. Given a prompt, generate a complete, engaging blog post that is informative, descriptive, and interesting to general readers. "
            "Each section should be a full paragraph (8-10 sentences) with sensory details, specific facts, and creative writing (such as metaphors or analogies when appropriate). "
            "Your writing should be lively and educational, like a nature magazine article, not overly technical.\n\n"
            "If the prompt mentions 'markdown', generate the blog in **Markdown** format. Otherwise, use **HTML**. "
            "Use the `search_photo_tool(keywords, count=4)` to retrieve up to 4 image URLs.\n\n"
            "- For **HTML**:\n"
            '  • Embed the **first 3** images using <img> tags placed inside a <div class="media-block"> with a related paragraph.\n'
            '  • Each <div class="media-block"> should contain the image first, followed by the paragraph.\n'
            "  • Style the block using `display: flex; gap: 20px; align-items: flex-start`.\n"
            "  • Each image should be styled as a square with width and height of 150px, `object-fit: cover`, and rounded corners.\n"
            "  • Use a <style> block at the top of the HTML to define `.media-block`, `img`, and `p` styles.\n\n"
            "- For **Markdown**: do **not embed any images** in the blog content. Only return text.\n\n"
            "- In both cases, return the **4th image** (or the only image if Markdown) as a `background_image` URL (not embedded).\n\n"
            "Return a raw Python dictionary (no extra explanation) with this structure:\n"
            "{\n"
            "  'blog_content': '...html or markdown...',\n"
            "  'blog_format': 'html' or 'markdown',\n"
            "  'background_image': 'https://example.com/bg.jpg'\n"
            "}"
        )

        user_input = f"Prompt: {prompt}"

        agent = Agent(
            name="BlogWriter",
            instructions=agent_instructions,
            tools=[search_photo_tool],
        )

        result = await Runner.run(agent, user_input)

        raw_output = result.final_output.strip()

        # Remove markdown ``` code block if present
        if raw_output.startswith("```"):
            raw_output = raw_output.split("```", maxsplit=2)[1].strip()

        # Remove "python\n" or "python\r\n" if it starts with it
        if raw_output.lower().startswith("python\n") or raw_output.lower().startswith(
            "python\r\n"
        ):
            raw_output = raw_output.split("\n", 1)[1].strip()

        # Now safely evaluate the cleaned string
        final_output = ast.literal_eval(raw_output)

        blog_content = final_output["blog_content"]
        blog_format = final_output["blog_format"]
        background_image = final_output.get("background_image")

        return blog_content, blog_format, background_image
