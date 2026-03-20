import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

try:
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    print('✅ Database connected successfully!')
    conn.close()
except Exception as e:
    print(f'❌ Connection failed: {e}')
