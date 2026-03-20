from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

print("Dropping all tables...")

with engine.connect() as conn:
    # Drop tables in reverse order (foreign key dependencies)
    tables = ['medicine_reminders', 'symptom_logs', 'consultations', 'users']
    
    for table in tables:
        try:
            conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
            print(f"✓ Dropped {table}")
        except Exception as e:
            print(f"  - {table} doesn't exist or error: {e}")
    
    conn.commit()

print("\nAll tables dropped! Restart the server to recreate them.")
