from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user_model import User
from schemas.user_schema import UserResponse
from dependencies.auth_dpendency import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """
    Fetch all users in the system.
    This endpoint is protected and requires an 'admin' role.
    """
    users = db.query(User).all()
    return users
