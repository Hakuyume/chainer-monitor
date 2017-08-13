#! /usr/bin/env python3

import argparse
import os
import sqlite3
import sys
import uuid

from common import connect_db


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--comment', default='')
    parser.add_argument('log')
    args = parser.parse_args()

    id_ = uuid.uuid4().node
    path = os.path.abspath(args.log)

    conn = connect_db()
    cur = conn.cursor()
    try:
        cur.execute(
            r'INSERT INTO logs VALUES(?,?,?)',
            (id_, path, args.comment))
        conn.commit()
    except sqlite3.IntegrityError:
        sys.exit('{:s} is already registered'.format(path))


if __name__ == '__main__':
    main()
