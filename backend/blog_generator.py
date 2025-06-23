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

    async def generate_blog(
        self, prompt: str, languages: list[str] = None
    ) -> tuple[dict, str, str | None]:
        try:
            if languages is None:
                languages = ["english"]

            agent_instructions = (
                "You are a professional storyteller and content creator. Given a prompt, generate complete, engaging content that is informative, descriptive, and interesting to general readers on ANY topic. "
                "Each section should be a full paragraph (8-10 sentences) with sensory details, specific facts, and creative writing (such as metaphors or analogies when appropriate). "
                "Your writing should be lively, educational, and engaging, adapting the tone to match the topic (e.g., adventurous for travel, scientific for tech, emotional for personal stories).\n\n"
                f"Generate content in the following languages: {', '.join(languages)}. "
                "For each language, ensure cultural appropriateness and natural expression. "
                "Chinese content should be culturally adapted, not directly translated. Use appropriate idioms and expressions for each culture.\n\n"
                "If the prompt mentions 'markdown', generate the content in **Markdown** format. Otherwise, use **HTML**. "
                "Use the `search_photo_tool(keywords, count=4)` to retrieve up to 4 image URLs based on the main topic.\n\n"
                "- For **HTML**:\n"
                '  • Embed the **first 3** images using <img> tags placed inside a <div class="media-block"> with a related paragraph.\n'
                '  • Each <div class="media-block"> should contain the image first, followed by the paragraph.\n'
                "  • Style the block using `display: flex; gap: 20px; align-items: flex-start`.\n"
                "  • Each image should be styled as a square with width and height of 150px, `object-fit: cover`, and rounded corners.\n"
                "  • Use a <style> block at the top of the HTML to define `.media-block`, `img`, and `p` styles.\n\n"
                "- For **Markdown**: do **not embed any images** in the content. Only return text.\n\n"
                "- In both cases, return the **4th image** (or the only image if Markdown) as a `background_image` URL (not embedded).\n\n"
                "IMPORTANT: Return ONLY a raw Python dictionary as a plain string. "
                "Do NOT wrap it in Markdown code blocks (do not use triple backticks like ```), "
                "do NOT prefix with 'python' or 'html'. Do NOT include any explanation. "
                "The output must be a clean string representing a Python dictionary exactly like this format:\n"
                "{\n"
                "  'content': {\n"
                "    'english': '...html or markdown content...',\n"
                "    'simplified_chinese': '...html or markdown content...',\n"
                "    'traditional_chinese': '...html or markdown content...'\n"
                "  },\n"
                "  'format': 'html' or 'markdown',\n"
                "  'background_image': 'https://example.com/bg.jpg'\n"
                "}\n"
                "Only include the languages requested in the content dictionary."
            )

            user_input = f"Prompt: {prompt}"

            agent = Agent(
                name="BlogWriter",
                instructions=agent_instructions,
                tools=[search_photo_tool],
            )

            result = await Runner.run(agent, user_input)

            raw_output = result.final_output.strip()

            # Now safely evaluate the cleaned string
            final_output = ast.literal_eval(raw_output)

            content_dict = final_output["content"]
            blog_format = final_output["format"]
            background_image = final_output.get("background_image")

            return content_dict, blog_format, background_image

        except Exception as e:
            raise Exception(f"Error generating blog content: {str(e)}") from e
