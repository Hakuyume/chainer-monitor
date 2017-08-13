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
    cur.execute(
        r'CREATE TABLE IF NOT EXISTS plots '
        r'(id INTEGER PRIMARY KEY, comment TEXT)')
    cur.execute(
        r'CREATE TABLE IF NOT EXISTS series '
        r'(id INTEGER PRIMARY KEY, plot_id INTEGER, log_id INTEGER, '
        r'color INTEGER, UNIQUE(plot_id, log_id))')

    return conn
