from auth.auth import verify_token
from fastapi import APIRouter, Depends

router = APIRouter(tags=["auth"])


@router.get("/me")
async def me(claims: dict = Depends(verify_token)):
    """
    Returns essential user information from the validated access token.
    This endpoint is protected and requires a valid token.
    """
    # Return a curated subset of claims for security and clarity
    return {
        "user_id": claims.get("sub"),  # The user's unique identifier
        "permissions": claims.get("permissions", []),
        # You can add other necessary claims here, e.g., email if it's present
    }
