'use strict';

let sync;

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
        return sync;
    }

    modify(data) {
        this._update(data);
        return this.sync();
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
        return sync;
    }

    add(data) {
        const id = Math.floor(Math.random() * (1 << 48));
        this._ids.push(id);
        this.get(id)._update(data);
        return this.sync();
    }

    remove(element) {
        this._ids = this._ids.filter((id) => id != element.id);
        return this.sync();
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

    add(data) {
        data.log = {id: data.log};
        return super.add(data);
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

class Monitor {
    constructor(entrypoint) {
        this.logs = new Logs(entrypoint + '/log');
        this.plots = new Plots(entrypoint + '/plot', this.logs);

        sync = Promise.all([
            fetch(entrypoint + '/log.json')
                .then((response) => response.json())
                .then((data) => this.logs._update(data)),
            fetch(entrypoint + '/plot.json')
                .then((response) => response.json())
                .then((data) => this.plots._update(data))
        ]);
    }
}
