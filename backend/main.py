from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import portfolio_db
from pydantic import BaseModel
from send_emails import send_email_func
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import hashlib
import jwt
import time 

app = FastAPI()

class EmailData(BaseModel):
    from_email: str
    subject: str
    body: str

class PortfolioItem(BaseModel):
    title: str
    description: str
    image: str
    link: str   

class LoginData(BaseModel):
    password: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://64.226.78.105/", "http://134.58.253.20/", "http://104.248.246.183/", "https://104.248.246.183/"],    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Pretend we have a hashed admin password in .env
ADMIN_HASH = os.getenv("ADMIN_HASH")
SECRET_KEY = os.getenv("SECRET_KEY")  # load from .env in real usage
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_in: int = 900) -> str:
    """
    Creates a JWT with payload `data` that expires in `expires_in` seconds (default 15 min).
    """
    payload = data.copy()
    # Set expiration time
    expire = int(time.time()) + expires_in
    payload.update({"exp": expire})

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@app.post("/admin/login")
def admin_login(data: LoginData):
    # Simple check: hash the incoming password and compare to stored hash
    hashed_input = hashlib.sha256(data.password.encode()).hexdigest()
    if hashed_input != ADMIN_HASH:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Credentials are valid -> create token
    token_data = {"sub": 'admin'}  # "subject" = user
    access_token = create_access_token(token_data, expires_in=900)  # 15 min
    return {"access_token": access_token, "token_type": "bearer"}


security = HTTPBearer()  # Bearer token scheme

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # 'sub' is the subject (username)
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/portfolios")
def get_portfolios():
    return {"data": portfolio_db.get_all()}

@app.post("/portfolios")
def create_portfolio(item: PortfolioItem, creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials  # Bearer token string
    user = verify_token(token)  # raises 401 on failure
    portfolio_db.insert(item.title, item.description, item.image, item.link)
    return {"message": "Portfolio item added successfully"}

@app.put("/portfolios/{id}")
def update_portfolio(id: str, item: PortfolioItem, creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials  # Bearer token string
    user = verify_token(token)  # raises 401 on failure
    success = portfolio_db.update(id, item.title, item.description, item.image, item.link)
    if success:
        return {"message": "Portfolio item updated"}
    raise HTTPException(status_code=404, detail="Portfolio item not found")

@app.delete("/portfolios/{id}")
def delete_portfolio(id: str, creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials  # Bearer token string
    user = verify_token(token)  # raises 401 on failure
    success = portfolio_db.delete(id)
    if success:
        return {"message": "Portfolio item deleted"}
    raise HTTPException(status_code=404, detail="Portfolio item not found")

@app.post("/send-email")
def send_email(email_data: EmailData):
    send_email_func(email_data.from_email, email_data.subject, email_data.body)
    return {"message": "Email sent successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)