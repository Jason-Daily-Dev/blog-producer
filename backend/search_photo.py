import requests


class PhotoSearcher:
    def __init__(self, pexels_api_key: str, unsplash_access_key: str):
        if not pexels_api_key:
            raise ValueError("PEXELS_API_KEY is not configured.")
        if not unsplash_access_key:
            raise ValueError("UNSPLASH_ACCESS_KEY is not configured.")
        self.pexels_api_key = pexels_api_key
        self.unsplash_access_key = unsplash_access_key

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
