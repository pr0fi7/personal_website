from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from models import portfolio_db
from pydantic import BaseModel
from send_emails import send_email_func

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


@app.get("/portfolios")
def get_portfolios():
    return {"data": portfolio_db.get_all()}

@app.post("/portfolios")
def create_portfolio(item: PortfolioItem, api_key: str = Header(None)):
    portfolio_db.insert(item.title, item.description, item.image, item.link)
    return {"message": "Portfolio item added successfully"}

@app.put("/portfolios/{id}")
def update_portfolio(id: str, item: PortfolioItem, api_key: str = Header(None)):
    success = portfolio_db.update(id, item.title, item.description, item.image, item.link)
    if success:
        return {"message": "Portfolio item updated"}
    raise HTTPException(status_code=404, detail="Portfolio item not found")

@app.delete("/portfolios/{id}")
def delete_portfolio(id: str, api_key: str = Header(None)):
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
    uvicorn.run(app, host="127.0.0.1", port=8000)
