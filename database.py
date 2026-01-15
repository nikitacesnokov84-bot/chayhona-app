import sqlite3
from datetime import datetime
import json

DB_PATH = 'chaykhona.db'

def init_db():
    """Инициализация базы данных"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Таблица заказов
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        items TEXT NOT NULL,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    ''')
    
    conn.commit()
    conn.close()

def add_user(user_id, username, first_name, last_name=''):
    """Добавить пользователя"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
        INSERT OR IGNORE INTO users (user_id, username, first_name, last_name)
        VALUES (?, ?, ?, ?)
        ''', (user_id, username, first_name, last_name))
        conn.commit()
        return True
    except Exception as e:
        print(f"Ошибка при добавлении пользователя: {e}")
        return False
    finally:
        conn.close()

def get_user(user_id):
    """Получить пользователя"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    return user

def add_order(user_id, items, total):
    """Добавить заказ"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        items_json = json.dumps(items) if isinstance(items, list) else items
        cursor.execute('''
        INSERT INTO orders (user_id, items, total, status)
        VALUES (?, ?, ?, 'new')
        ''', (user_id, items_json, total))
        
        conn.commit()
        order_id = cursor.lastrowid
        conn.close()
        return order_id
    except Exception as e:
        print(f"Ошибка при добавлении заказа: {e}")
        conn.close()
        return None

def get_user_orders(user_id):
    """Получить заказы пользователя"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT order_id, items, total, status, created_at 
    FROM orders 
    WHERE user_id = ? 
    ORDER BY created_at DESC
    ''', (user_id,))
    
    orders = cursor.fetchall()
    conn.close()
    
    return orders

def update_order_status(order_id, status):
    """Обновить статус заказа"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
        UPDATE orders 
        SET status = ? 
        WHERE order_id = ?
        ''', (status, order_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Ошибка при обновлении статуса: {e}")
        return False
    finally:
        conn.close()

def get_all_orders():
    """Получить все заказы"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT order_id, user_id, items, total, status, created_at 
    FROM orders 
    ORDER BY created_at DESC
    ''')
    
    orders = cursor.fetchall()
    conn.close()
    
    return orders

def get_stats():
    """Получить статистику"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM users')
    users_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM orders')
    orders_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT SUM(total) FROM orders')
    total_revenue = cursor.fetchone()[0] or 0
    
    conn.close()
    
    return {
        'users': users_count,
        'orders': orders_count,
        'revenue': total_revenue
    }
