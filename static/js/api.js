function Log(id, path, comment) {
    this.id = id;
    this.path = path;
    this.comment = comment;
};


function Logs() {
    this.logs = [];
};

Logs.prototype.fetch = function(callback) {
    var logs = this;

    $.getJSON('/api/logs', function(res) {
        logs.logs = [];
        $.each(res, function(id, log) {
            logs.logs.push(new Log(id, log.path, log.comment));
        });
        callback();
    });
};

Logs.prototype.each = function(callback) {
    var logs = this;

    $.each(logs.logs, function(i, log) {
        callback(log);
    });
};

Logs.prototype.remove = function(log, callback) {
    var logs = this;

    $.ajax({
        url: '/api/logs/' + log.id,
        type: 'DELETE',
        success: function() {
            logs.fetch(callback);
        }
    });
};
