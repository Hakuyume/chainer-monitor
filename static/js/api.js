function Log(id, path, comment) {
    this.id = id;
    this.path = path;
    this.comment = comment;
};


function Logs() {
    this.logs = [];
};

Logs.prototype.fetch = function(callback) {
    var self = this;

    $.getJSON('/api/logs', function(res) {
        self.logs = [];
        $.each(res, function(id, log) {
            self.logs.push(new Log(id, log.path, log.comment));
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

function Plot(id, comment) {
    this.id = id;
    this.comment = comment;
};

function Plots() {
    this.plots = [];
};

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
