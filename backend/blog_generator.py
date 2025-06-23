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
                "You are a professional storyteller and content creator. Given a prompt, generate complete, engaging blog content that is informative, descriptive, and entertaining for general readers on ANY topic. "
                "Each section should be a full paragraph (8–10 sentences) using sensory details, creative writing techniques (such as metaphors or analogies), and factual or emotional insights. "
                "The overall story should be **structured with a clear beginning, middle, and end**, and should be **at least 800–1200 words** in total.\n\n"
                f"Generate content in the following languages: {', '.join(languages)}. "
                "For each language, ensure cultural appropriateness and natural expression. "
                "Chinese content should be culturally adapted and not directly translated. Use region-appropriate idioms, expressions, and tone.\n\n"
                "If the prompt mentions 'markdown', generate the content in **Markdown** format. Otherwise, use **HTML** format.\n\n"
                "Start each blog post with a compelling title — formatted appropriately (`<h1>` for HTML, `#` for Markdown).\n\n"
                "Immediately under the title, include a **subtitle-style summary**:\n"
                '- For **HTML**, use `<h3 class="subtitle">Your short summary here</h3>` and center it visually.\n'
                "- For **Markdown**, use `##` followed by the summary (2–3 sentence overview).\n\n"
                "Use the `search_photo_tool(keywords, count=6)` to retrieve up to 6 image URLs based on the main topic.\n\n"
                "- For **HTML output**:\n"
                "  • Use a `<style>` block at the top to define styles.\n"
                "  • Include the following CSS style for the subtitle:\n"
                "    `.subtitle { font-family: 'Georgia', serif; font-style: italic; font-size: 1.1em; text-align: center; margin-bottom: 30px; color: #444; }`\n"
                '  • Embed the first 5 images using `<div class="media-block">`, image first, then paragraph.\n'
                "  • Style media blocks with `display: flex; gap: 20px; align-items: flex-start; margin-bottom: 20px`, and images as square (150px).\n\n"
                "- For **Markdown output**:\n"
                "  • Start with `# Title`, followed by `## Subtitle` and the main content.\n"
                "  • Do **not embed images**.\n\n"
                "- In both formats, return the **6th image** as the `background_image` (not embedded in the content).\n\n"
                "IMPORTANT: Return ONLY a raw Python dictionary as a plain string. "
                "Do NOT wrap it in Markdown code blocks (no triple backticks), and do NOT prefix it with 'python' or 'html'. "
                "The output must be a clean string representing a Python dictionary exactly in the format below:\n\n"
                "{\n"
                "  'content': {\n"
                "    'english': '...html or markdown content including title and subtitle...',\n"
                "    'simplified_chinese': '...html or markdown content including title and subtitle...',\n"
                "    'traditional_chinese': '...html or markdown content including title and subtitle...'\n"
                "  },\n"
                "  'format': 'html' or 'markdown',\n"
                "  'background_image': 'https://example.com/image.jpg'\n"
                "}\n"
                "Only include the languages requested in the `content` dictionary."
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
