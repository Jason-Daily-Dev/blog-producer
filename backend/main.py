import os

from auth.auth import auth
from fastapi import Depends, FastAPI, Security
from fastapi.openapi.models import OAuth2, SecuritySchemeType
from fastapi.openapi.utils import get_openapi
from fastapi_auth0 import Auth0User
from routers import blog_router

app = FastAPI()


# Generate OpenAPI schema with Auth0ImplicitBearer
@app.on_event("startup")
def customize_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Blog API",
        version="1.0.0",
        description="API for Blog Generator",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "Auth0ImplicitBearer": {
            "type": "oauth2",
            "flows": {
                "implicit": {
                    "authorizationUrl": f"https://{auth.domain}/authorize",
                    "scopes": {
                        "openid": "OpenID Connect scope",
                        "profile": "Access user profile information",
                        "email": "Access user email address",
                        "write:blog": "Permission to create or modify blog content",
                    },
                }
            },
        }
    }
    openapi_schema["security"] = [{"Auth0ImplicitBearer": []}]
    app.openapi_schema = openapi_schema


# Public endpoint
@app.get("/ping")
def ping():
    return {"message": "pong"}


# Include routers
app.include_router(blog_router.router)
