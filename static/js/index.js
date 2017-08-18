(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _param(data) {
    return Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
}

var Element = function () {
    function Element(id, entrypoint) {
        _classCallCheck(this, Element);

        this.id = id;
        this._entrypoint = entrypoint;
    }

    _createClass(Element, [{
        key: '_update',
        value: function _update(data) {
            delete data.id;
            for (var key in data) {
                this[key] = data[key];
            }
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this = this;

            return fetch(this._entrypoint + '/' + this.id).then(function (response) {
                return response.json();
            }).then(function (data) {
                return _this._update(data);
            });
        }
    }, {
        key: 'modify',
        value: function modify(data) {
            var _this2 = this;

            return fetch(this._entrypoint + '/' + this.id, { method: 'PUT', body: _param(data) }).then(function () {
                return _this2.sync();
            });
        }
    }]);

    return Element;
}();

var ElementSet = function () {
    function ElementSet(entrypoint) {
        _classCallCheck(this, ElementSet);

        this._entrypoint = entrypoint;
        this._ids = [];
        this._elements = {};
    }

    _createClass(ElementSet, [{
        key: '_update',
        value: function _update(data) {
            this._ids = Object.keys(data);
            for (var id in data) {
                this.get(id)._update(data[id]);
            }
        }
    }, {
        key: 'get',
        value: function get(id) {
            if (!(id in this._elements)) this._elements[id] = this._new(id);
            return this._elements[id];
        }
    }, {
        key: Symbol.iterator,
        value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id;

            return regeneratorRuntime.wrap(function value$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;
                            _iterator = this._ids[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context.next = 12;
                                break;
                            }

                            id = _step.value;
                            _context.next = 9;
                            return this.get(id);

                        case 9:
                            _iteratorNormalCompletion = true;
                            _context.next = 5;
                            break;

                        case 12:
                            _context.next = 18;
                            break;

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t0;

                        case 18:
                            _context.prev = 18;
                            _context.prev = 19;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 21:
                            _context.prev = 21;

                            if (!_didIteratorError) {
                                _context.next = 24;
                                break;
                            }

                            throw _iteratorError;

                        case 24:
                            return _context.finish(21);

                        case 25:
                            return _context.finish(18);

                        case 26:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    }, {
        key: 'sync',
        value: function sync() {
            var _this3 = this;

            return fetch(this._entrypoint).then(function (response) {
                return response.json();
            }).then(function (data) {
                return _this3._update(data);
            });
        }
    }, {
        key: 'add',
        value: function add(data) {
            var _this4 = this;

            return fetch(this._entrypoint, { method: 'POST', body: _param(data) }).then(function () {
                return _this4.sync();
            });
        }
    }, {
        key: 'remove',
        value: function remove(element) {
            var _this5 = this;

            return fetch(this._entrypoint + '/' + element.id, { method: 'DELETE' }).then(function () {
                return _this5.sync();
            });
        }
    }]);

    return ElementSet;
}();

var Log = function (_Element) {
    _inherits(Log, _Element);

    function Log() {
        _classCallCheck(this, Log);

        return _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).apply(this, arguments));
    }

    return Log;
}(Element);

var Logs = function (_ElementSet) {
    _inherits(Logs, _ElementSet);

    function Logs() {
        _classCallCheck(this, Logs);

        return _possibleConstructorReturn(this, (Logs.__proto__ || Object.getPrototypeOf(Logs)).apply(this, arguments));
    }

    _createClass(Logs, [{
        key: '_new',
        value: function _new(id) {
            return new Log(id, this._entrypoint);
        }
    }]);

    return Logs;
}(ElementSet);

var Series = function (_Element2) {
    _inherits(Series, _Element2);

    function Series(id, entrypoint, logs) {
        _classCallCheck(this, Series);

        var _this8 = _possibleConstructorReturn(this, (Series.__proto__ || Object.getPrototypeOf(Series)).call(this, id, entrypoint));

        _this8._logs = logs;
        return _this8;
    }

    _createClass(Series, [{
        key: '_update',
        value: function _update(data) {
            if ('log' in data) {
                this.log = this._logs.get(data.log.id);
                this.log._update(data.log);
                delete data.log;
            }
            _get(Series.prototype.__proto__ || Object.getPrototypeOf(Series.prototype), '_update', this).call(this, data);
        }
    }]);

    return Series;
}(Element);

var SeriesSet = function (_ElementSet2) {
    _inherits(SeriesSet, _ElementSet2);

    function SeriesSet(entrypoint, logs) {
        _classCallCheck(this, SeriesSet);

        var _this9 = _possibleConstructorReturn(this, (SeriesSet.__proto__ || Object.getPrototypeOf(SeriesSet)).call(this, entrypoint));

        _this9._logs = logs;
        return _this9;
    }

    _createClass(SeriesSet, [{
        key: '_new',
        value: function _new(id) {
            return new Series(id, this._entrypoint, this._logs);
        }
    }]);

    return SeriesSet;
}(ElementSet);

var Plot = function (_Element3) {
    _inherits(Plot, _Element3);

    function Plot(id, entrypoint, logs) {
        _classCallCheck(this, Plot);

        var _this10 = _possibleConstructorReturn(this, (Plot.__proto__ || Object.getPrototypeOf(Plot)).call(this, id, entrypoint));

        _this10.series = new SeriesSet(entrypoint + '/' + id + '/series', logs);
        return _this10;
    }

    _createClass(Plot, [{
        key: '_update',
        value: function _update(data) {
            if ('series' in data) {
                this.series._update(data.series);
                delete data.series;
            }
            _get(Plot.prototype.__proto__ || Object.getPrototypeOf(Plot.prototype), '_update', this).call(this, data);
        }
    }]);

    return Plot;
}(Element);

var Plots = function (_ElementSet3) {
    _inherits(Plots, _ElementSet3);

    function Plots(entrypoint, logs) {
        _classCallCheck(this, Plots);

        var _this11 = _possibleConstructorReturn(this, (Plots.__proto__ || Object.getPrototypeOf(Plots)).call(this, entrypoint));

        _this11._logs = logs;
        return _this11;
    }

    _createClass(Plots, [{
        key: '_new',
        value: function _new(id) {
            return new Plot(id, this._entrypoint, this._logs);
        }
    }]);

    return Plots;
}(ElementSet);

var Monitor = function Monitor(entrypoint) {
    _classCallCheck(this, Monitor);

    this.logs = new Logs(entrypoint + '/log');
    this.plots = new Plots(entrypoint + '/plot', this.logs);
};

exports.default = Monitor;

},{}],2:[function(require,module,exports){
'use strict';

var _api = require('api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var monitor = new _api2.default('./api');

function update_plots() {
    var tbody = $('#plots > tbody');
    tbody.empty();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var plot = _step.value;

            var tr = $('<tr></tr>').appendTo(tbody);
            $('<td></td>').appendTo(tr).append($('<a></a>').text(plot.comment != '' ? plot.comment : '<no comment>').attr('href', './plot?' + plot.id));
            $('<td></td>').appendTo(tr).attr('class', 'col-md-1').append($('<button></button>').text('Delete').attr('type', 'button').attr('class', 'btn btn-danger').on('click', function () {
                return monitor.plots.remove(plot).then(update_plots);
            }));
        };

        for (var _iterator = monitor.plots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function update_logs() {
    var tbody = $('#logs > tbody');
    tbody.empty();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        var _loop2 = function _loop2() {
            var log = _step2.value;

            var tr = $('<tr></tr>').appendTo(tbody);
            $('<td></td>').appendTo(tr).text(log.path);
            $('<td></td>').appendTo(tr).text(log.comment);
            $('<td></td>').appendTo(tr).attr('class', 'col-md-1').append($('<button></button>').text('Delete').attr('type', 'button').attr('class', 'btn btn-danger').on('click', function () {
                return monitor.logs.remove(log).then(update_logs);
            }));
        };

        for (var _iterator2 = monitor.logs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop2();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

$(document).ready(function () {
    monitor.plots.sync().then(update_plots);
    monitor.logs.sync().then(update_logs);

    $('#plot-add-button').on('click', function () {
        var text = $('#comment');
        monitor.plots.add({ comment: text.val() }).then(function () {
            update_plots();
            text.val('');
        });
    });
});

},{"api":1}]},{},[2]);
