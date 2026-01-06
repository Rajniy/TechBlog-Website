import sqlite3
from sqlite3 import Connection

DB_NAME = 'techblog.db'

def get_db_connection() -> Connection:
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Create articles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            excerpt TEXT NOT NULL,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            date TEXT NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

def seed_articles():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if articles already exist
    cursor.execute('SELECT COUNT(*) FROM articles')
    count = cursor.fetchone()[0]
    if count > 0:
        conn.close()
        return

    # Insert sample articles
    articles = [
        (
            "Introduction to Web Development",
            "Learn the fundamentals of modern web development...",
            "Web Development",
            "web-development.jpg",
            "2024-03-15",
            "John Doe",
            """
            <div class="article-image" style="background-image: url(images/web-development.jpg)"></div>
            <p>Full article content here about web development...</p>
            """
        ),
        (
            "The Future of AI",
            "Exploring the potential of artificial intelligence...",
            "Artificial Intelligence",
            "ai.jpg",
            "2024-03-10",
            "Jane Smith",
            """
            <div class="article-image" style="background-image: url(images/ai.jpg)"></div>
            <p>Full article content here about AI and its future...</p>
            """
        ),
        (
            "Graphic Design Trends 2024",
            "Discover the latest trends in graphic design...",
            "Graphic Design",
            "graphic-design.jpg",
            "2024-03-20",
            "Alice Johnson",
            """
            <div class="article-image" style="background-image: url(images/graphic-design.jpg)"></div>
            <p>Full article content here about graphic design trends...</p>
            """
        )
    ]

    cursor.executemany('''
        INSERT INTO articles (title, excerpt, category, image, date, author, content)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', articles)

    conn.commit()
    conn.close()
