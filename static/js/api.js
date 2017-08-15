const entrypoint = '/api';


class Log {
    constructor(id) {
        this.id = id;
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(entrypoint + '/logs/' + this.id)
                .done((data) => {
                    this.path = data.path;
                    this.comment = data.comment;
                    this.content = data.content;
                    resolve();
                })
                .fail(reject)
        );
    }
}

class Logs {
    constructor() {
        this._ids = null;
        this._logs = {};
    }

    _get(id) {
        if (!(id in this._logs))
            this._logs[id] = new Log(id);
        return this._logs[id];
    }

    each(callback) {
        $.each(this._ids, (_, id) => callback(this._get(id)));
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(entrypoint + '/logs')
                .done((data) => {
                    this._ids = Object.keys(data);
                    $.each(data, (id, params) => {
                        const log = this._get(id);
                        log.path = params.path;
                        log.comment = params.comment;
                    });
                    resolve();
                })
                .fail(reject)
        );
    }

    remove(log) {
        return new Promise(
            (resolve, reject) =>
                $.ajax({url: entrypoint + '/logs/' + log.id, type: 'DELETE'})
                .done(resolve).fail(reject)
        ).then(() => this.sync());
    }
}

class Plot {
    constructor(id) {
        this.id = id;
    }
}

class Plots {
    constructor() {
        this._ids = null;
        this._plots = {};
    }

    _get(id) {
        if (!(id in this._plots))
            this._plots[id] = new Plot(id);
        return this._plots[id];
    }

    each(callback) {
        $.each(this._ids, (_, id) => callback(this._get(id)));
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(entrypoint + '/plots')
                .done((data) => {
                    this._ids = Object.keys(data);
                    $.each(data, (id, params) => {
                        const plot = this._get(id);
                        plot.comment = params.comment;
                    });
                    resolve();
                })
                .fail(reject)
        );
    }

    add(params) {
        return new Promise(
            (resolve, reject) =>
                $.post(entrypoint + '/plots', $.param(params))
                .done(resolve).fail(reject)
        ).then(() => this.sync());
    }

    remove(plot) {
        return new Promise(
            (resolve, reject) =>
                $.ajax({url: entrypoint + '/plots/' + plot.id, type: 'DELETE'})
                .done(resolve).fail(reject)
        ).then(() => this.sync());
    }
}

class Monitor {
    constructor() {
        this.logs = new Logs();
        this.plots = new Plots();
    }
}

// function Series(id, log, key, color, yaxis) {
//     this.id = id;
//     this.log = log;
//     this.key = key;
//     this.color = color;
//     this.yaxis = yaxis;
// }

// function Plot(id, comment) {
//     this.id = id;
//     this.comment = comment;
//     this.series = {};
// }

// Plot.prototype.fetch = function(callback) {
//     var self = this;

//     $.getJSON('/api/plots/' + self.id, function(res) {
//         self.comment = res.comment;
//         $.each(res.series, function(id, series) {
//             if (id in self.series) {
//                 self.series[id].log.comment = series.log.comment;
//                 self.series[id].key = series.key;
//                 self.series[id].color = series.color;
//                 self.series[id].yaxis = series.yaxis;
//             } else {
//                 self.series[id] = new Series(
//                     id,
//                     new Log(series.log.id, null, series.log.comment),
//                     series.key,
//                     series.color,
//                     series.yaxis);
//             }
//         });
//         $.each(self.series, function(id, _) {
//             if (id in res.series) return;
//             delete self.series[id];
//         });
//         if (callback) callback();
//     });
// };

// Plot.prototype.series_add = function(series, callback) {
//     var self = this;

//     $.post(
//         '/api/series',
//         $.param({
//             'plot': self.id,
//             'log': series.log.id,
//             'key': series.key,
//             'color': series.color,
//             'yaxis': series.yaxis,
//         }),
//         function() {
//             self.fetch(callback);
//         }
//     );
// };

// Plot.prototype.series_remove = function(series, callback) {
//     var self = this;

//     $.ajax({
//         url: '/api/series/' + series.id,
//         type: 'DELETE',
//         success: function() {
//             self.fetch(callback);
//         }
//     });
// };

// Plot.prototype.series_modify = function(series, key, value, callback) {
//     var self = this;

//     var data = {};
//     data[key] = value;
//     $.ajax({
//         url: '/api/series/' + series.id,
//         type: 'PUT',
//         data: $.param(data),
//         success: function() {
//             self.fetch(callback);
//         }
//     });
// };

// function Plots() {
//     this.plots = [];
// }

// Plots.prototype.fetch = function(callback) {
//     var self = this;

//     $.getJSON('/api/plots', function(res) {
//         self.plots = [];
//         $.each(res, function(id, plot) {
//             self.plots.push(new Plot(id, plot.comment));
//         });
//         if (callback) callback();
//     });
// };

// Plots.prototype.each = function(callback) {
//     var self = this;

//     $.each(self.plots, function(_, plot) {
//         callback(plot);
//     });
// };

// Plots.prototype.add = function(plot, callback) {
//     var self = this;

// };

// Plots.prototype.remove = function(plot, callback) {
//     var self = this;

//     $.ajax({
//         url: '/api/plots/' + plot.id,
//         type: 'DELETE',
//         success: function() {
//             self.fetch(callback);
//         }
//     });
// };
