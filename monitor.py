#! /usr/bin/env python3

import argparse
import bottle
import json
import math
import os

from common import connect_db
from common import gen_id


conn = connect_db()


@bottle.get('/api/logs')
def get_logs():
    cur = conn.cursor()
    return {
        id_: {'path': path, 'comment': comment}
        for (id_, path, comment) in cur.execute(r'SELECT * FROM logs')}


@bottle.get('/api/logs/<id_>')
def get_log(id_):
    cur = conn.cursor()
    cur.execute(r'SELECT * FROM logs WHERE id=?', (id_,))

    l = cur.fetchone()
    if l is None:
        return bottle.HTTPResponse(status=404)

    _, path, comment = l

    try:
        content = json.load(open(path))
    except FileNotFoundError:
        content = list()

    content = [
        {k: (v if math.isfinite(v) else None) for k, v in entry.items()}
        for entry in content]

    return {
        'id': id_,
        'path': path,
        'comment': comment,
        'content': content}


@bottle.get('/api/plots/<id_>')
def get_plot(id_):
    cur = conn.cursor()
    cur.execute(r'SELECT * FROM plots WHERE id=?', (id_,))

    p = cur.fetchone()
    if p is None:
        return bottle.HTTPResponse(status=404)

    _, comment = p

    series = {
        id_: {'log': log, 'color': color}
        for (id_, _, log, color) in
        cur.execute(r'SELECT * FROM series WHERE plot=?', (id_,))}

    return {
        'id': id_,
        'comment': comment,
        'series': series}


@bottle.post('/api/plots')
def new_plot():
    cur = conn.cursor()

    params = bottle.request.params

    id_ = gen_id()
    if 'comment' in params:
        comment = params['comment']
    else:
        comment = ''

    cur.execute(r'INSERT INTO plots VALUES(?,?)', (id_, ''))
    conn.commit()

    return {
        'id': id_,
        'comment': comment,
        'series': dict()}

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
