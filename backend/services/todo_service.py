from sqlalchemy.orm import Session
from models.todo_model import Todo
from schemas.todo_schema import TodoCreate, TodoUpdate

def get_todos(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Todo).filter(Todo.owner_id == user_id).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int, user_id: int):
    return db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == user_id).first()

def create_todo(db: Session, todo: TodoCreate, user_id: int):
    db_todo = Todo(**todo.model_dump(), owner_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, db_todo: Todo, todo_update: TodoUpdate):
    # For PUT, we update all fields provided in the schema
    update_data = todo_update.model_dump()
    for key, value in update_data.items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, db_todo: Todo):
    db.delete(db_todo)
    db.commit()
    return db_todo