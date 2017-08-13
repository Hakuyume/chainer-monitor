import os
import sqlite3
import uuid


def gen_id():
    return uuid.uuid4().node


def connect_db():
    conn = sqlite3.connect(
        os.path.join(os.path.dirname(__file__), 'monitor.db'))
    cur = conn.cursor()

    cur.execute(
        r'CREATE TABLE IF NOT EXISTS logs '
        r'(id INTEGER PRIMARY KEY, path TEXT UNIQUE, comment TEXT)')

    return conn
