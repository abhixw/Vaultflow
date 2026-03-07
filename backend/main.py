from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, todo_routes, admin_routes
from database import Base, engine
from models.user_model import User
from models.todo_model import Todo
from fastapi.responses import JSONResponse
import traceback
import sys

app = FastAPI(title="Vaultflow API")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    # Log the error internally (simplified for assignment)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

# Create the database tables
Base.metadata.create_all(bind=engine)

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(auth_routes.router)
api_v1_router.include_router(todo_routes.router)
api_v1_router.include_router(admin_routes.router)

app.include_router(api_v1_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Vaultflow API is running"}