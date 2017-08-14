function Log(id, path, comment) {
    this.id = id;
    this.path = path;
    this.comment = comment;
}

Log.prototype.fetch = function(callback) {
    var self = this;

    $.getJSON('/api/logs/' + self.id, function(res) {
        self.path = res.path;
        self.comment = res.comment;
        self.content = res.content;
        callback();
    });
};

function Logs() {
    this.logs = {};
}

Logs.prototype.fetch = function(callback) {
    var self = this;

    $.getJSON('/api/logs', function(res) {
        $.each(res, function(id, log) {
            if (id in self.logs) {
                self.logs[id].path = log.path;
                self.logs[id].comment = log.comment;
            } else {
                self.logs[id] = new Log(id, log.path, log.comment);
            }
        });
        $.each(self.logs, function(id, _) {
            if (id in res) return;
            delete self.logs[id];
        });
        callback();
    });
};

Logs.prototype.each = function(callback) {
    var self = this;

    $.each(self.logs, function(_, log) {
        callback(log);
    });
};

Logs.prototype.remove = function(log, callback) {
    var self = this;

    $.ajax({
        url: '/api/logs/' + log.id,
        type: 'DELETE',
        success: function() {
            self.fetch(callback);
        }
    });
};

function Series(id, log, key, color, yaxis) {
    this.id = id;
    this.log = log;
    this.key = key;
    this.color = color;
    this.yaxis = yaxis;
}

function Plot(id, comment) {
    this.id = id;
    this.comment = comment;
    this.series = {};
}

Plot.prototype.fetch = function(callback) {
    var self = this;

    $.getJSON('/api/plots/' + self.id, function(res) {
        self.comment = res.comment;
        $.each(res.series, function(id, series) {
            if (id in self.series) {
                self.series[id].log.comment = series.log.comment;
                self.series[id].key = series.key;
                self.series[id].color = series.color;
                self.series[id].yaxis = series.yaxis;
            } else {
                self.series[id] = new Series(
                    id,
                    new Log(series.log.id, null, series.log.comment),
                    series.key,
                    series.color,
                    series.yaxis);
            }
        });
        $.each(self.series, function(id, _) {
            if (id in res.series) return;
            delete self.series[id];
        });
        callback();
    });
};

Plot.prototype.series_add = function(series, callback) {
    var self = this;

    $.post(
        '/api/series',
        $.param({
            'plot': self.id,
            'log': series.log.id,
            'key': series.key,
            'color': series.color,
            'yaxis': series.yaxis,
        }),
        function() {
            self.fetch(callback);
        }
    );
};

Plot.prototype.series_remove = function(series, callback) {
    var self = this;

    $.ajax({
        url: '/api/series/' + series.id,
        type: 'DELETE',
        success: function() {
            self.fetch(callback);
        }
    });
};

Plot.prototype.series_modify = function(series, key, value, callback) {
    var self = this;

    var data = {};
    data[key] = value;
    $.ajax({
        url: '/api/series/' + series.id,
        type: 'PUT',
        data: $.param(data),
        success: function() {
            self.fetch(callback);
        }
    });
};

function Plots() {
    this.plots = [];
}

Plots.prototype.fetch = function(callback) {
    var self = this;

    $.getJSON('/api/plots', function(res) {
        self.plots = [];
        $.each(res, function(id, plot) {
            self.plots.push(new Plot(id, plot.comment));
        });
        callback();
    });
};

Plots.prototype.each = function(callback) {
    var self = this;

    $.each(self.plots, function(_, plot) {
        callback(plot);
    });
};

Plots.prototype.add = function(plot, callback) {
    var self = this;

    $.post(
        '/api/plots',
        $.param({'comment': plot.comment}),
        function() {
            self.fetch(callback);
        }
    );
};

Plots.prototype.remove = function(plot, callback) {
    var self = this;

    $.ajax({
        url: '/api/plots/' + plot.id,
        type: 'DELETE',
        success: function() {
            self.fetch(callback);
        }
    });
};
