from fastapi import APIRouter, Query
from pydantic import BaseModel
import httpx
from urllib.parse import urlparse
import os

router = APIRouter(prefix="/v1/search", tags=["Research & Search"])

SEARXNG_BASE_URL = os.getenv("SEARXNG_BASE_URL", "https://searx.be")

class SearchQuery(BaseModel):
    query: str
    max_results: int = 5

class SearchResultItem(BaseModel):
    title: str
    url: str
    snippet: str
    domain: str

@router.post("/")
async def search_web(body: SearchQuery):
    query = body.query.strip()
    if not query:
        return {"results": [], "query": ""}

    results = []
    
    # 1. Probe SearXNG
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            res = await client.get(
                f"{SEARXNG_BASE_URL}/search",
                params={"q": query, "format": "json", "language": "en"}
            )
            if res.status_code == 200:
                data = res.json()
                for r in data.get("results", [])[:body.max_results]:
                    domain = urlparse(r.get("url", "")).hostname or "web"
                    results.append(SearchResultItem(
                        title=r.get("title", "Source"),
                        url=r.get("url", ""),
                        snippet=r.get("content", ""),
                        domain=domain
                    ))
                if results:
                    return {"results": results, "engine": "SearXNG"}
    except Exception:
        pass

    # 2. Open Search Fallback
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            res = await client.get(
                "https://api.duckduckgo.com/",
                params={"q": query, "format": "json", "no_html": "1"}
            )
            if res.status_code == 200:
                data = res.json()
                if data.get("AbstractURL") and data.get("AbstractText"):
                    domain = urlparse(data["AbstractURL"]).hostname or "web"
                    results.append(SearchResultItem(
                        title=data.get("Heading", query),
                        url=data["AbstractURL"],
                        snippet=data["AbstractText"],
                        domain=domain
                    ))
    except Exception:
        pass

    return {"results": results, "engine": "Open Web Fallback"}
