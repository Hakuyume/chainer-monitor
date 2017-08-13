#! /usr/bin/env python3

import argparse
import bottle
import json
import math
import os

from common import connect_db
from common import gen_id


class Monitor(bottle.Bottle):

    def __init__(self):
        super().__init__()

        self.conn = connect_db()

        self.get('/api/logs', callback=self.get_logs)
        self.get('/api/logs/<id_>', callback=self.get_log)

        self.post('/api/plots', callback=self.new_plot)
        self.get('/api/plots/<id_>', callback=self.get_plot)

        self.route('/<filepath>', callback=self.static)
        self.route('/root', callback=self.root)
        self.route('/plots/<id_>', callback=self.plot)

    def get_logs(self):
        cur = self.conn.cursor()
        return {
            id_: {'path': path, 'comment': comment}
            for (id_, path, comment) in cur.execute(r'SELECT * FROM logs')}

    def get_log(self, id_):
        cur = self.conn.cursor()
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
            {k: (v if math.isfinite(v) else None)
             for k, v in entry.items()}
            for entry in content]

        return {
            'id': id_,
            'path': path,
            'comment': comment,
            'content': content}

    def new_plot(self):
        cur = self.conn.cursor()

        params = self.request.params

        id_ = gen_id()
        if 'comment' in params:
            comment = params['comment']
        else:
            comment = ''

        cur.execute(r'INSERT INTO plots VALUES(?,?)', (id_, comment))
        self.conn.commit()

        return {
            'id': id_,
            'comment': comment,
            'series': dict()}

    def get_plot(self, id_):
        cur = self.conn.cursor()
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

    def static(self, filepath):
        return bottle.static_file(
            filepath + '.html',
            root=os.path.join(os.path.dirname(__file__), 'static'))

    def plot(self, id_):
        return self.static('plot')

    def root(self):
        r = bottle.HTTPResponse(status=302)
        r.set_header('Location', 'logs')
        return r


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()

    app = Monitor()
    app.run(port=args.port)


if __name__ == '__main__':
    main()
