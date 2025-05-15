import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.openapi.models import OAuthFlowImplicit
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi_auth0 import Auth0

# Load environment variables
load_dotenv()

# Initialize Auth0
auth = Auth0(
    domain=os.getenv("AUTH0_DOMAIN"),
    api_audience=os.getenv("AUTH0_API_AUDIENCE"),
)

# Add Auth0ImplicitBearer scheme
auth.implicit_scheme = OAuthFlowsModel(
    implicit=OAuthFlowImplicit(
        authorizationUrl=f"https://{os.getenv('AUTH0_DOMAIN')}/authorize",
        scopes={
            "openid": "OpenID Connect scope",
            "profile": "Access user profile information",
            "email": "Access user email address",
            "write:blog": "Permission to create or modify blog content",
        },
    )
)


def get_auth():
    return auth
