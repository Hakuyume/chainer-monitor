#! /usr/bin/env python3

import argparse
import bottle
import json
import math
import os
import sqlite3

from common import connect_db
from common import gen_id


class Monitor(bottle.Bottle):

    def __init__(self):
        super().__init__()

        self.conn = connect_db()

        self.get('/api/log', callback=self.list_logs)
        self.get('/api/log/<id_:int>', callback=self.get_log)
        self.delete('/api/log/<id_:int>', callback=self.del_log)

        self.get('/api/plot', callback=self.list_plots)
        self.post('/api/plot', callback=self.new_plot)
        self.get('/api/plot/<id_:int>', callback=self.get_plot)
        self.delete('/api/plot/<id_:int>', callback=self.del_plot)

        self.get('/api/plot/<plot:int>/series', callback=self.list_series)
        self.post('/api/plot/<plot:int>/series', callback=self.new_series)
        self.get(
            '/api/plot/<plot:int>/series/<id_:int>',
            callback=self.get_series)
        self.delete(
            '/api/plot/<plot:int>/series/<id_:int>',
            callback=self.del_series)
        self.put(
            '/api/plot/<plot:int>/series/<id_:int>',
            callback=self.update_series)

        self.route('/', callback=self.root)
        self.route('/plot', callback=self.plot)
        self.route('/<path:path>', callback=self.static)

    def list_logs(self):
        cur = self.conn.cursor()
        return {
            id_: {'id': id_, 'path': path, 'comment': comment}
            for (id_, path, comment) in
            cur.execute(r'SELECT id, path, comment FROM logs')}

    def get_log(self, id_):
        cur = self.conn.cursor()

        cur.execute(r'SELECT path, comment FROM logs WHERE id=?', (id_,))
        l = cur.fetchone()
        if l is None:
            return bottle.HTTPResponse(status=404)

        path, comment = l

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

            cur.execute(r'SELECT null FROM logs WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM logs WHERE id=?', (id_,))
            cur.execute(r'DELETE FROM series WHERE log=?', (id_,))

        return {'id': id_}

    def list_plots(self):
        cur = self.conn.cursor()
        return {
            id_: {'id': id_, 'comment': comment}
            for (id_, comment) in
            cur.execute(r'SELECT id, comment FROM plots')}

    def new_plot(self):
        params = bottle.request.params

        id_ = gen_id()
        comment = params.comment

        with self.conn:
            self.conn.execute(r'INSERT INTO plots VALUES(?,?)', (id_, comment))

        return {'id': id_}

    def get_plot(self, id_):
        cur = self.conn.cursor()
        cur.execute(r'SELECT comment FROM plots WHERE id=?', (id_,))

        p = cur.fetchone()
        if p is None:
            return bottle.HTTPResponse(status=404)

        comment, = p

        series = {
            id_: {
                'id': id_,
                'log': {'id': log, 'comment': log_comment},
                'key': key,
                'color': color,
                'yaxis': yaxis}
            for (id_, log, key, color, yaxis, log_comment) in
            cur.execute(
                r'SELECT series.id, series.log, '
                r'series.key, series.color, series.yaxis, logs.comment '
                r'FROM series INNER JOIN logs ON series.log=logs.id '
                r'WHERE series.plot=?',
                (id_,))}

        return {
            'id': id_,
            'comment': comment,
            'series': series}

    def del_plot(self, id_):
        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT null FROM plots WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM plots WHERE id=?', (id_,))
            cur.execute(r'DELETE FROM series WHERE plot=?', (id_,))

        return {'id': id_}

    def list_series(self, plot):
        cur = self.conn.cursor()

        cur.execute(r'SELECT comment FROM plots WHERE id=?', (plot,))
        if cur.fetchone() is None:
            return bottle.HTTPResponse(status=404)

        return {
            id_: {
                'id': id_,
                'log': {'id': log, 'comment': log_comment},
                'key': key,
                'color': color,
                'yaxis': yaxis}
            for (id_, log, key, color, yaxis, log_comment) in
            cur.execute(
                r'SELECT series.id, series.log, '
                r'series.key, series.color, series.yaxis, logs.comment '
                r'FROM series INNER JOIN logs ON series.log=logs.id '
                r'WHERE series.plot=?',
                (plot,))}

    def new_series(self, plot):
        params = bottle.request.params

        id_ = gen_id()
        log = params.log
        key = params.key
        color = params.color
        yaxis = params.yaxis

        try:
            color = int(color if not color == '' else 0)
        except ValueError:
            return bottle.HTTPResponse(status=400)

        try:
            yaxis = int(yaxis if not yaxis == '' else 0)
        except ValueError:
            return bottle.HTTPResponse(status=400)

        try:
            with self.conn:
                cur = self.conn.cursor()

                cur.execute(r'SELECT null FROM plots WHERE id=?', (plot,))
                if cur.fetchone() is None:
                    return bottle.HTTPResponse(status=400)

                cur.execute(r'SELECT null FROM logs WHERE id=?', (log,))
                if cur.fetchone() is None:
                    return bottle.HTTPResponse(status=400)

                cur.execute(
                    r'INSERT INTO series VALUES(?,?,?,?,?,?)',
                    (id_, plot, log, key, color, yaxis))

        except sqlite3.IntegrityError:
            return bottle.HTTPResponse(status=400)

        return {'id': id_}

    def get_series(self, id_, plot):
        cur = self.conn.cursor()

        cur.execute(
            r'SELECT log, key, color, yaxis FROM series WHERE id=?', (id_,))
        s = cur.fetchone()
        if s is None:
            return bottle.HTTPResponse(status=404)

        log, key, color, yaxis = s

        cur.execute(r'SELECT comment FROM logs WHERE id=?', (log,))
        l = cur.fetchone()
        if l is None:
            return bottle.HTTPResponse(status=404)

        log_comment, = l

        return {
            'id': id_,
            'log': {'id': log, 'comment': log_comment},
            'key': key,
            'color': color,
            'yaxis': yaxis}

    def del_series(self, id_, plot):
        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT null FROM series WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            cur.execute(r'DELETE FROM series WHERE id=?', (id_,))

        return {'id': id_}

    def update_series(self, id_, plot):
        params = bottle.request.params

        key = params.key
        color = params.color
        yaxis = params.yaxis

        update = dict()

        if not key == '':
            update['key'] = key

        if not color == '':
            try:
                update['color'] = int(color)
            except ValueError:
                return bottle.HTTPResponse(status=400)

        if not yaxis == '':
            try:
                update['yaxis'] = int(yaxis)
            except ValueError:
                return bottle.HTTPResponse(status=400)

        if len(update) == 0:
            return bottle.HTTPResponse(status=400)

        with self.conn:
            cur = self.conn.cursor()

            cur.execute(r'SELECT null FROM series WHERE id=?', (id_,))
            if cur.fetchone() is None:
                return bottle.HTTPResponse(status=404)

            keys, values = zip(*update.items())
            keys = ' '.join('{:s}=?'.format(k) for k in keys)
            cur.execute(
                r'UPDATE series SET {:s} WHERE id=?'.format(keys),
                (*values, id_,))

        return {'id': id_}

    def root(self):
        return self.static('index.html')

    def plot(self):
        return self.static('plot.html')

    def static(self, path):
        return bottle.static_file(
            path,
            root=os.path.join(os.path.dirname(__file__), 'static'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()

    app = Monitor()
    app.run(port=args.port)


if __name__ == '__main__':
    main()
