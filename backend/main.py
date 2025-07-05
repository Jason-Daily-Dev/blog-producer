from config import get_settings
from fastapi import FastAPI
from routers import auth_router, blog_router

settings = get_settings()


app = FastAPI(
    title="Blog Producer API",
    version="1.0.0",
    swagger_ui_init_oauth={
        "clientId": settings.AUTH0_CLIENT_ID,
        "scopes": "openid profile email write:blog",
        "usePkceWithAuthorizationCodeGrant": True,
        "useBasicAuthenticationWithAccessCodeGrant": False,
        "appName": "Blog Producer API - Swagger UI",
        # NOTE: The 'client_secret' field will still appear in the Swagger UI pop-up
        # because the UI template is generic. However, it is not used for a public
        # client with the PKCE flow, and Auth0 will ignore it.
    },
)


# Public endpoint
@app.get("/ping")
def ping():
    return {"message": "pong"}


# Include routers
app.include_router(auth_router.router)
app.include_router(blog_router.router)
