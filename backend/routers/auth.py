from fastapi import APIRouter, HTTPException, status, Depends
from schemas import UserCreate, UserLogin, Token, UserResponse
from database import user_collection
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
import auth

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": user.username,
        "password": hashed_password
    }
    
    result = await user_collection.insert_one(new_user)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    
    return {"id": str(created_user["_id"]), "username": created_user["username"]}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"id": str(current_user["_id"]), "username": current_user["username"]}

@router.post("/reset-password")
async def reset_password(user: UserLogin):
    existing_user = await user_collection.find_one({"username": user.username})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    hashed_password = get_password_hash(user.password)
    await user_collection.update_one(
        {"username": user.username},
        {"$set": {"password": hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

@router.post("/google-demo", response_model=Token)
async def google_demo_login():
    # Check if demo user exists
    demo_email = "google_demo_user@example.com"
    existing_user = await user_collection.find_one({"username": demo_email})
    
    if not existing_user:
        # Create demo user if not exists
        hashed_password = get_password_hash("demo_password_123")
        new_user = {
            "username": demo_email,
            "password": hashed_password
        }
        await user_collection.insert_one(new_user)
    
    # Generate token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": demo_email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
