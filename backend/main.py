from fastapi import FastAPI
from routers import auth_router, blog_router

app = FastAPI()


# Fixed the OpenAPI schema to ensure proper integration with Auth0ImplicitBearer


# Public endpoint
@app.get("/ping")
def ping():
    return {"message": "pong"}


# Include routers
app.include_router(auth_router.router)
app.include_router(blog_router.router)
