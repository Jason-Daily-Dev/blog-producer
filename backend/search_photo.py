import os

import requests
from dotenv import load_dotenv

load_dotenv()


class PhotoSearcher:
    def __init__(self):
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        if not self.unsplash_access_key:
            raise ValueError("Unsplash Access Key is not set in environment variables.")

    def search_photo(self, query: str):
        url = "https://api.unsplash.com/search/photos"
        headers = {"Authorization": f"Client-ID {self.unsplash_access_key}"}
        params = {"query": query, "per_page": 1}

        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            if data["results"]:
                return data["results"][0]["urls"]["regular"]
            else:
                return None  # No results found
        else:
            raise Exception(
                f"Unsplash API error: {response.status_code} - {response.text}"
            )


if __name__ == "__main__":
    photo_searcher = PhotoSearcher()
    query = "nature"
    photo_url = photo_searcher.search_photo(query)
    if photo_url:
        print(f"Photo URL: {photo_url}")
    else:
        print("No photo found.")
