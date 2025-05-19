import httpx
import jwt
from auth.auth import get_auth
from fastapi import APIRouter, Depends, HTTPException, Request

auth = get_auth()

router = APIRouter(tags=["auth"], dependencies=[Depends(auth.implicit_scheme)])


@router.get("/me")
async def me(request: Request):
    # Extract token from the Authorization header
    authorization_header = request.headers.get("authorization")
    if not authorization_header or not authorization_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = authorization_header[len("Bearer ") :]

    # Decode the token to extract permissions
    try:
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        permissions = decoded_token.get("permissions", [])
    except jwt.exceptions.PyJWTError as e:
        raise HTTPException(status_code=400, detail=f"Invalid token: {str(e)}")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://{auth.domain}/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        )
        userinfo = resp.json()

    return {
        "userinfo": userinfo,
        "permissions": permissions,
    }
