from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from database import get_db_connection, init_db, seed_articles

app = Flask(__name__, static_folder='../', static_url_path='/')
CORS(app)  # Enable CORS for all routes

import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'Write Secret key here')  # Use env var or default

# Initialize database and seed articles
init_db()
seed_articles()

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/api/articles', methods=['GET'])
def get_articles():
    conn = get_db_connection()
    articles = conn.execute('SELECT id, title, excerpt, category, image, date, author FROM articles').fetchall()
    conn.close()
    articles_list = [dict(article) for article in articles]
    return jsonify(articles_list)

@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    conn = get_db_connection()
    article = conn.execute('SELECT * FROM articles WHERE id = ?', (article_id,)).fetchone()
    conn.close()
    if article:
        return jsonify(dict(article))
    else:
        return jsonify({"error": "Article not found"}), 404

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        print(f"Signup attempt: username={username}, email={email}, password={'*' * len(password) if password else None}")

        if not username or not email or not password:
            print("Signup failed: missing username, email or password")
            return jsonify({"error": "Username, email and password are required"}), 400

        # Email format validation
        import re
        email_regex = r'^[^@\s]+@[^@\s]+\.[^@\s]+$'
        if not re.match(email_regex, email):
            print("Signup failed: invalid email format")
            return jsonify({"error": "Invalid email format"}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        try:
            conn = get_db_connection()
            conn.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', (username, email, hashed_password))
            conn.commit()
            conn.close()
            print(f"User {username} successfully signed up")
        except sqlite3.IntegrityError as e:
            print(f"Signup failed: {e}")
            return jsonify({"error": "Username or email already exists"}), 409

        token = jwt.encode({'username': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm='HS256')
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        return jsonify({"token": token})
    except Exception as e:
        print(f"Unexpected error during signup: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    if isinstance(data, str):
        import json
        data = json.loads(data)
    email = data.get('email')
    password = data.get('password')

    print(f"Login attempt: email={email}, password={'*' * len(password) if password else None}")

    if not email or not password:
        print("Login failed: missing email or password")
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        print(f"User {email} successfully logged in")
        token = jwt.encode({'email': email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm='HS256')
        user_data = {
            "username": user['username'],
            "email": user['email']
        }
        return jsonify({"token": token, "user": user_data})
    else:
        print(f"Login failed: invalid credentials for email {email}")
        return jsonify({"error": "Invalid email or password"}), 401

@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through HTTP errors
    if hasattr(e, 'code') and hasattr(e, 'name'):
        response = e.get_response()
        response.data = jsonify({
            "error": e.name,
            "description": e.description,
        }).data
        response.content_type = "application/json"
        return response
    # Non-HTTP exceptions
    return jsonify({
        "error": "Internal Server Error",
        "description": str(e)
    }), 500

if __name__ == '__main__':
    app.run(debug=True)
