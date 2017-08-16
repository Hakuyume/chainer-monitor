'use strict';

class Element {
    constructor(id, entrypoint) {
        this.id = id;
        this._entrypoint = entrypoint;
    }

    _update(data) {
        delete data.id;
        for (const key in data)
            this[key] = data[key];
    }

    sync() {
        return fetch(this._entrypoint + '/' + this.id)
            .then((response) => response.json())
            .then((data) => this._update(data));
    }

    modify(data) {
        return fetch(
            this._entrypoint + '/' + this.id,
            {method: 'PUT', body: $.param(data)})
            .then(() => this.sync());
    }
}

class ElementSet {
    constructor(entrypoint) {
        this._entrypoint = entrypoint;
        this._ids = [];
        this._elements = {};
    }

    _update(data) {
        this._ids = Object.keys(data);
        for (const id in data)
            this.get(id)._update(data[id]);
    }

    get(id) {
        if (!(id in this._elements))
            this._elements[id] = this._new(id);
        return this._elements[id];
    }

    *[Symbol.iterator]() {
        for (const id of this._ids)
            yield this.get(id);
    }

    sync() {
        return fetch(this._entrypoint)
            .then((response) => response.json())
            .then((data) => this._update(data));
    }

    add(data) {
        return fetch(
            this._entrypoint,
            {method: 'POST', body: $.param(data)})
            .then(() => this.sync());
    }

    remove(element) {
        return fetch(
            this._entrypoint + '/' + element.id,
            {method: 'DELETE'})
            .then(() => this.sync());
    }

}

class Log extends Element {}

class Logs extends ElementSet{
    _new(id) {
        return new Log(id, this._entrypoint);
    }
}

class Series extends Element {
    constructor(id, entrypoint, logs) {
        super(id, entrypoint);
        this._logs = logs;
    }

    _update(data) {
        if ('log' in data) {
            this.log = this._logs.get(data.log.id);
            this.log._update(data.log);
            delete data.log;
        }
        super._update(data);
    }
}

class SeriesSet extends ElementSet{
    constructor(entrypoint, logs) {
        super(entrypoint);
        this._logs = logs;
    }

    _new(id) {
        return new Series(id, this._entrypoint, this._logs);
    }
}

class Plot extends Element {
    constructor(id, entrypoint, logs) {
        super(id, entrypoint);
        this.series = new SeriesSet(entrypoint + '/' + id + '/series', logs);
    }

    _update(data) {
        if ('series' in data) {
            this.series._update(data.series);
            delete data.series;
        }
        super._update(data);
    }
}

class Plots extends ElementSet {
    constructor(entrypoint, logs) {
        super(entrypoint);
        this._logs = logs;
    }

    _new(id) {
        return new Plot(id, this._entrypoint, this._logs);
    }
}

export default class Monitor {
    constructor(entrypoint) {
        this.logs = new Logs(entrypoint + '/log');
        this.plots = new Plots(entrypoint + '/plot', this.logs);
    }
}
