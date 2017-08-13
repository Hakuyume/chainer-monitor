#! /usr/bin/env python3

import argparse
import bottle
import json
import math
import os

from common import connect_db

conn = connect_db()


@bottle.get('/api/logs')
def logs():
    cur = conn.cursor()
    return {
        id_: {'path': path, 'comment': comment}
        for (id_, path, comment) in cur.execute(r'SELECT * FROM logs')}


@bottle.get('/api/logs/<id_>')
def log(id_):
    cur = conn.cursor()
    cur.execute(r'SELECT * FROM logs WHERE id=?', (id_,))

    log = cur.fetchone()
    if log is None:
        return bottle.HTTPResponse(status=404)

    _, path, comment = log

    try:
        content = json.load(open(path))
    except FileNotFoundError:
        content = list()

    content = [
        {k: (v if math.isfinite(v) else None) for k, v in entry.items()}
        for entry in content]

    return {
        'path': path,
        'comment': comment,
        'content': content}


@bottle.get('/<filepath>')
def static(filepath):
    return bottle.static_file(
        filepath + '.html',
        root=os.path.join(os.path.dirname(__file__), 'static'))


@bottle.get('/plots/<id_>')
def static_plot(id_):
    return bottle.static_file(
        'plot.html',
        root=os.path.join(os.path.dirname(__file__), 'static'))


@bottle.get('/')
def root():
    r = bottle.HTTPResponse(status=302)
    r.set_header('Location', 'logs')
    return r


parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8080)
args = parser.parse_args()

bottle.run(port=args.port)
