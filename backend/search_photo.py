import os

import requests
from dotenv import load_dotenv

load_dotenv()


class PhotoSearcher:
    def __init__(self):
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        if not self.unsplash_access_key:
            raise ValueError("UNSPLASH_ACCESS_KEY is not set in environment variables.")

        self.pexels_api_key = os.getenv("PEXELS_API_KEY")
        if not self.pexels_api_key:
            raise ValueError("PEXELS_API_KEY is not set in environment variables.")

    def search_photos(self, query: str, count: int = 4) -> list[str]:
        """
        Search Pexels first, then Unsplash if needed.
        """
        images = []

        # Try Pexels first
        try:
            pexels_url = "https://api.pexels.com/v1/search"
            headers = {"Authorization": self.pexels_api_key}
            params = {"query": query, "per_page": count}
            response = requests.get(pexels_url, headers=headers, params=params)

            if response.status_code == 200:
                data = response.json()
                photos = data.get("photos", [])
                images += [photo["src"]["medium"] for photo in photos]
        except Exception as e:
            print(f"Pexels error: {e}")

        # If not enough images, try Unsplash
        if len(images) < count:
            try:
                unsplash_url = "https://api.unsplash.com/search/photos"
                headers = {"Authorization": f"Client-ID {self.unsplash_access_key}"}
                params = {"query": query, "per_page": count}
                response = requests.get(unsplash_url, headers=headers, params=params)

                if response.status_code == 200:
                    data = response.json()
                    remaining = count - len(images)
                    results = data.get("results", [])
                    images += [item["urls"]["regular"] for item in results[:remaining]]
            except Exception as e:
                print(f"Unsplash error: {e}")

        return images[:count]


# For testing only
if __name__ == "__main__":
    photo_searcher = PhotoSearcher()
    query = "nature"
    photo_urls = photo_searcher.search_photos(query, count=4)
    if photo_urls:
        print("Photo URLs:")
        for url in photo_urls:
            print(url)
    else:
        print("No photos found.")
