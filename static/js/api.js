const entrypoint = '/api';

class ElementSet {
    constructor(entrypoint, type) {
        this._entrypoint = entrypoint;
        this._type = type;
        this._ids = null;
        this._elements = {};
    }

    get(id) {
        if (!(id in this._elements))
            this._elements[id] = new this._type(id);
        return this._elements[id];
    }

    each(callback) {
        $.each(this._ids, (_, id) => callback(this.get(id)));
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(this._entrypoint)
                .done((data) => {
                    this._ids = Object.keys(data);
                    $.each(data, (id, params) => this.get(id).update(params));
                    resolve();
                })
                .fail(reject)
        );
    }

    add(params) {
        return new Promise(
            (resolve, reject) =>
                $.post(this._entrypoint, $.param(params))
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

class Log {
    constructor(id) {
        this.id = id;
    }

    update(params) {
        delete params['id'];
        $.extend(this, params);
    }

    sync() {
        return new Promise(
            (resolve, reject) =>
                $.getJSON(entrypoint + '/logs/' + this.id)
                .done((data) => {
                    this.update(data);
                    resolve();
                })
                .fail(reject)
        );
    }
}

class Logs extends ElementSet{
    constructor() {
        super(entrypoint + '/logs', Log);
    }
}

class Plot {
    constructor(id) {
        this.id = id;
    }

    update(params) {
        delete params['id'];
        $.extend(this, params);
    }
}

class Plots extends ElementSet {
    constructor() {
        super(entrypoint + '/plots', Plot);
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
