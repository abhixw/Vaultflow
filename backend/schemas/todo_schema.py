from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: str | None = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: str
    description: str
    completed: bool

class TodoResponse(TodoBase):
    id: int
    completed: bool
    owner_id: int

    class Config:
        from_attributes = True