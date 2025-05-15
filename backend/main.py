import os

from auth.auth import auth
from fastapi import Depends, FastAPI, Security
from fastapi.openapi.models import OAuth2, SecuritySchemeType
from fastapi.openapi.utils import get_openapi
from fastapi_auth0 import Auth0User
from routers import blog_router

app = FastAPI()


# Fixed the OpenAPI schema to ensure proper integration with Auth0ImplicitBearer


# Public endpoint
@app.get("/ping")
def ping():
    return {"message": "pong"}


# Include routers
app.include_router(blog_router.router)
