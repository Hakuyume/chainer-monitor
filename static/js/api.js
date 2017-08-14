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
