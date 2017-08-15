class Element {
    constructor(id, entrypoint) {
        this.id = id;
        this._entrypoint = entrypoint;
    }

    _update(params) {
        delete params.id;
        $.extend(this, params);
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(this._entrypoint + '/' + this.id)
                .done((data) => {
                    this._update(data);
                    resolve();
                })
                .fail(reject)
        );
    }

    modify(data) {
        return new Promise(
            (resolve, reject) =>
                $.ajax({
                    url: this._entrypoint + '/' + this.id,
                    type: 'PUT',
                    data: $.param(data)})
                .done(resolve).fail(reject)
        ).then(() => this.sync());
    }

}

class ElementSet {
    constructor(entrypoint) {
        this._entrypoint = entrypoint;
        this._ids = null;
        this._elements = {};
    }

    _update(data) {
        this._ids = Object.keys(data);
        $.each(data, (id, d) => this.get(id)._update(d));
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
        return new Promise(
            (resolve, reject) =>
                $.getJSON(this._entrypoint)
                .done((data) => {
                    this._update(data);
                    resolve();
                })
                .fail(reject)
        );
    }

    add(data) {
        return new Promise(
            (resolve, reject) =>
                $.post(this._entrypoint, $.param(data))
                .done(resolve).fail(reject)
        ).then(() => this.sync());
    }

    remove(element) {
        return new Promise(
            (resolve, reject) =>
                $.ajax({url: this._entrypoint + '/' + element.id, type: 'DELETE'})
                .done(resolve).fail(reject)
        ).then(() => this.sync());
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

class Monitor {
    constructor(entrypoint) {
        this.logs = new Logs(entrypoint + '/log');
        this.plots = new Plots(entrypoint + '/plot', this.logs);
    }
}
