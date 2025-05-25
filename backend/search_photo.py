import os

import requests
from dotenv import load_dotenv

load_dotenv()


class PhotoSearcher:
    def __init__(self):
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        if not self.unsplash_access_key:
            raise ValueError("Unsplash Access Key is not set in environment variables.")

    def search_photos(self, query: str, count: int = 4) -> list[str]:
        """
        Search Unsplash for multiple photos related to a query.

        Args:
            query (str): Search keyword.
            count (int): Number of photo URLs to return.

        Returns:
            list[str]: List of image URLs.
        """
        url = "https://api.unsplash.com/search/photos"
        headers = {"Authorization": f"Client-ID {self.unsplash_access_key}"}
        params = {"query": query, "per_page": count}

        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            return [item["urls"]["regular"] for item in results[:count]]
        else:
            raise Exception(
                f"Unsplash API error: {response.status_code} - {response.text}"
            )


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
