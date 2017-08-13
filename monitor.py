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
        self.delete('/api/logs/<id_>', callback=self.del_log)

        self.get('/api/plots', callback=self.get_plots)
        self.post('/api/plots', callback=self.new_plot)
        self.get('/api/plots/<id_>', callback=self.get_plot)
        self.delete('/api/plots/<id_>', callback=self.del_plot)

        self.post('/api/series', callback=self.new_series)
        self.delete('/api/series/<id_>', callback=self.del_series)

        self.route('/<filepath>', callback=self.static)
        self.route('/', callback=self.root)
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

    def del_log(self, id_):
        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT * FROM logs WHERE id=?', (id_,))
            l = cur.fetchone()
            if l is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM logs WHERE id=?', (id_,))
            cur.execute(r'DELETE FROM series WHERE log=?', (id_,))

        return {'id': id_}

    def get_plots(self):
        cur = self.conn.cursor()
        return {
            id_: {'comment': comment}
            for (id_, comment) in cur.execute(r'SELECT * FROM plots')}

    def new_plot(self):
        params = bottle.request.params

        id_ = gen_id()
        comment = params.comment

        with self.conn:
            self.conn.execute(r'INSERT INTO plots VALUES(?,?)', (id_, comment))

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

    def del_plot(self, id_):
        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT * FROM plots WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM plots WHERE id=?', (id_,))
            cur.execute(r'DELETE FROM series WHERE plot=?', (id_,))

        return {'id': id_}

    def new_series(self):
        params = bottle.request.params

        id_ = gen_id()
        plot = params.plot
        log = params.log

        color = params.color
        if color == '':
            color = 0

        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT * FROM plots WHERE id=?', (plot,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'SELECT * FROM logs WHERE id=?', (log,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(
                r'INSERT INTO series VALUES(?,?,?,?)', (id_, plot, log, color))

        return {
            'id': id_,
            'plot': plot,
            'log': log,
            'color': color}

    def del_series(self, id_):
        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT * FROM series WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM series WHERE id=?', (id_,))

        return {'id': id_}

    def static(self, filepath):
        return bottle.static_file(
            filepath + '.html',
            root=os.path.join(os.path.dirname(__file__), 'static'))

    def plot(self, id_):
        return self.static('plot')

    def root(self):
        r = bottle.HTTPResponse(status=302)
        r.set_header('Location', 'plots')
        return r


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()

    app = Monitor()
    app.run(port=args.port)


if __name__ == '__main__':
    main()
