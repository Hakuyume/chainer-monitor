import os
import sqlite3


def connect_db():
    conn = sqlite3.connect(
        os.path.join(os.path.dirname(__file__), 'monitor.db'))
    cur = conn.cursor()

    cur.execute(
        r'CREATE TABLE IF NOT EXISTS logs '
        r'(id INTEGER PRIMARY KEY, path TEXT UNIQUE, comment TEXT)')

    return conn
