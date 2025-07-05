import requests
from config import get_settings
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import JWTError, jwt

settings = get_settings()

# This configures the security scheme in Swagger UI.
# The audience is added as a query parameter to the authorizationUrl, which is the recommended approach.
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"https://{settings.AUTH0_DOMAIN}/authorize?audience={settings.AUTH0_API_AUDIENCE}",
    tokenUrl=f"https://{settings.AUTH0_DOMAIN}/oauth/token",
    scopes={
        "openid": "OpenID Connect scope",
        "profile": "Access user profile information",
        "email": "Access user email address",
        "write:blog": "Permission to create or modify blog content",
    },
)

# Fetch the JWKS from Auth0, which contains the public keys to verify JWTs
jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
jwks = requests.get(jwks_url).json()


class AuthError(HTTPException):
    def __init__(self, error: dict, status_code: int):
        super().__init__(status_code=status_code, detail=error)


def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Validates the JWT token.
    This is the primary dependency for protected endpoints.
    """
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Unable to parse authentication token.",
            },
            status.HTTP_401_UNAUTHORIZED,
        )

    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    if not rsa_key:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Unable to find appropriate key.",
            },
            status.HTTP_401_UNAUTHORIZED,
        )

    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=settings.AUTH0_API_AUDIENCE,
            issuer=f"https://{settings.AUTH0_DOMAIN}/",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthError(
            {"code": "token_expired", "description": "Token is expired."},
            status.HTTP_401_UNAUTHORIZED,
        )
    except jwt.JWTClaimsError:
        raise AuthError(
            {
                "code": "invalid_claims",
                "description": "Incorrect claims, please check the audience and issuer.",
            },
            status.HTTP_401_UNAUTHORIZED,
        )
    except Exception:
        raise AuthError(
            {
                "code": "invalid_header",
                "description": "Unable to parse authentication token.",
            },
            status.HTTP_401_UNAUTHORIZED,
        )


def require_scope(required_scope: str):
    """
    Returns a dependency that checks for a specific permission in the token claims.
    """

    def dependency(claims: dict = Depends(verify_token)):
        permissions = claims.get("permissions", [])
        if required_scope not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required scope: {required_scope}",
            )

    return dependency
