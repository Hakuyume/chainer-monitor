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

var _sync = void 0;

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
            return _sync;
        }
    }, {
        key: 'modify',
        value: function modify(data) {
            this._update(data);
            return this.sync();
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
            return _sync;
        }
    }, {
        key: 'add',
        value: function add(data) {
            var id = Math.floor(Math.random() * (1 << 48));
            this._ids.push(id);
            this.get(id)._update(data);
            return this.sync();
        }
    }, {
        key: 'remove',
        value: function remove(element) {
            this._ids = this._ids.filter(function (id) {
                return id != element.id;
            });
            return this.sync();
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

        var _this3 = _possibleConstructorReturn(this, (Series.__proto__ || Object.getPrototypeOf(Series)).call(this, id, entrypoint));

        _this3._logs = logs;
        return _this3;
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

        var _this4 = _possibleConstructorReturn(this, (SeriesSet.__proto__ || Object.getPrototypeOf(SeriesSet)).call(this, entrypoint));

        _this4._logs = logs;
        return _this4;
    }

    _createClass(SeriesSet, [{
        key: '_new',
        value: function _new(id) {
            return new Series(id, this._entrypoint, this._logs);
        }
    }, {
        key: 'add',
        value: function add(data) {
            data.log = { id: data.log };
            return _get(SeriesSet.prototype.__proto__ || Object.getPrototypeOf(SeriesSet.prototype), 'add', this).call(this, data);
        }
    }]);

    return SeriesSet;
}(ElementSet);

var Plot = function (_Element3) {
    _inherits(Plot, _Element3);

    function Plot(id, entrypoint, logs) {
        _classCallCheck(this, Plot);

        var _this5 = _possibleConstructorReturn(this, (Plot.__proto__ || Object.getPrototypeOf(Plot)).call(this, id, entrypoint));

        _this5.series = new SeriesSet(entrypoint + '/' + id + '/series', logs);
        return _this5;
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

        var _this6 = _possibleConstructorReturn(this, (Plots.__proto__ || Object.getPrototypeOf(Plots)).call(this, entrypoint));

        _this6._logs = logs;
        return _this6;
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
    var _this7 = this;

    _classCallCheck(this, Monitor);

    this.logs = new Logs(entrypoint + '/log');
    this.plots = new Plots(entrypoint + '/plot', this.logs);

    _sync = Promise.all([fetch(entrypoint + '/log.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        return _this7.logs._update(data);
    }), fetch(entrypoint + '/plot.json').then(function (response) {
        return response.json();
    }).then(function (data) {
        return _this7.plots._update(data);
    })]);
};

exports.default = Monitor;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.int2rgb = int2rgb;
exports.hex2int = hex2int;
exports.int2hex = int2hex;
function int2rgb(c) {
    return 'rgb(' + (c >> 16 & 0xff) + ',' + (c >> 8 & 0xff) + ',' + (c >> 0 & 0xff) + ')';
}

function hex2int(c) {
    if (c[0] == '#') {
        c = c.slice(1);
    }
    return parseInt(c, 16);
}

function int2hex(c) {
    c = parseInt(c).toString(16);
    return '#' + ('000000' + c).slice(-6);
}

},{}],3:[function(require,module,exports){
'use strict';

var _api = require("api");

var _api2 = _interopRequireDefault(_api);

var _color = require("color");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var monitor = new _api2.default('./api');
var plot = monitor.plots.get(location.search.slice(1));

var colors = [0xff0000, 0x00ff00, 0x0000ff, 0x808000, 0x008080, 0x800080];

function update_series() {
    var _arr = [0, 1];

    for (var _i = 0; _i < _arr.length; _i++) {
        var yaxis = _arr[_i];
        var tbody = $('#series-' + yaxis + ' > tbody');
        tbody.empty();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            var _loop = function _loop() {
                var series = _step3.value;

                if (series.yaxis != yaxis) return "continue";

                var tr = $('<tr></tr>').appendTo(tbody);
                $('<td></td>').appendTo(tr).append($('<input></input>').attr('type', 'color').attr('class', 'legend-color').attr('value', (0, _color.int2hex)(series.color)).on('change', function () {
                    series.modify({ color: (0, _color.hex2int)($(this).val()) }).then(update_series);
                }));
                $('<td></td>').appendTo(tr).attr('width', '70%').text(series.log.comment + ': ' + series.key);
                $('<td></td>').appendTo(tr).append($('<button></button>').text('Delete').attr('type', 'button').attr('class', 'btn btn-danger btn-sm pull-right').on('click', function () {
                    return plot.series.remove(series).then(update_series);
                }));
            };

            for (var _iterator3 = plot.series[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _ret = _loop();

                if (_ret === "continue") continue;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }

    var used_colors = new Set();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = plot.series[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _series = _step.value;

            used_colors.add(_series.color);
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

    if (used_colors.has((0, _color.hex2int)(dialog.color.val()))) {
        var color = Math.floor(Math.random() * (1 << 24));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = colors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var c = _step2.value;

                if (!used_colors.has(c)) {
                    color = c;
                    break;
                }
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

        dialog.color.val((0, _color.int2hex)(color));
    }

    update_chart();
}

var chart = null;
function update_chart() {
    var xunit = $('input[name=xunit]:checked').val();
    var npoint = $('input[name=npoint]:checked').val();
    var yscales = ['linear', 'linear'];
    var _arr2 = [0, 1];
    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var yaxis = _arr2[_i2];
        if ($('#use-logscale-' + yaxis).is(':checked')) yscales[yaxis] = 'logarithmic';
        if (chart && chart.options.scales.yAxes[yaxis].type != yscales[yaxis]) {
            chart.destroy();
            chart = null;
        }
    }

    var xmin = 0;
    var xmax = 0;

    var datasets = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = plot.series[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _series2 = _step4.value;

            if (!_series2.log.content) continue;

            var data_with_key = [];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = _series2.log.content[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var entry = _step5.value;

                    if (_series2.key in entry) data_with_key.push({ x: entry[xunit], y: entry[_series2.key] });
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            xmax = Math.max(xmax, data_with_key[data_with_key.length - 1].x);

            var interval = 1;
            if (npoint != '' && data_with_key.length > npoint) interval = data_with_key.length / npoint;

            var data = [];
            for (var i = 0; i < data_with_key.length; i += interval) {
                data.push(data_with_key[Math.floor(i)]);
            }datasets.push({
                label: _series2.log.comment,
                data: data,
                borderColor: (0, _color.int2rgb)(_series2.color),
                yAxisID: 'y' + _series2.yaxis,
                pointDot: false,
                fill: false
            });
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    if (!chart) {
        chart = new Chart($('#plot'), {
            type: 'line',
            data: { datasets: datasets },
            options: {
                elements: {
                    line: { tension: 0 }
                },
                scales: {
                    xAxes: [{ type: 'linear', position: 'bottom' }],
                    yAxes: [{ id: 'y0', type: yscales[0], position: 'left' }, { id: 'y1', type: yscales[1], position: 'right',
                        gridLines: { drawOnChartArea: false } }]
                },
                legend: { display: false },
                animation: false
            }
        });
    }

    chart.data.datasets = datasets;
    chart.options.scales.xAxes[0].ticks.min = xmin;
    chart.options.scales.xAxes[0].ticks.max = xmax;
    chart.update();
}

function update_dialog(yaxis) {
    dialog.log.prop('disabled', true);
    dialog.key.prop('disabled', true);
    dialog.yaxis.val([yaxis]);
    dialog.button.prop('disabled', true);

    monitor.logs.sync().then(function () {
        dialog.log.empty();
        $('<option></option>').appendTo(dialog.log);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = monitor.logs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var log = _step6.value;

                $('<option></option>').appendTo(dialog.log).attr('value', log.id).text(log.comment);
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        dialog.log.prop('disabled', false);
    });
}

async function sync_logs() {
    var logs = new Set();
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = plot.series[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _series3 = _step7.value;

            logs.add(_series3.log);
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    var promises = [];
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = logs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var log = _step8.value;

            promises.push(log.sync());
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }

    await Promise.all(promises);
    update_chart();
}

var timer = null;
function set_timer() {
    if ($('#auto-update').prop('checked')) {
        if (!timer) timer = setInterval(sync_logs, 5000);
    } else {
        clearInterval(timer);
        timer = null;
    }
}

var dialog = void 0;
$(document).ready(function () {
    $('input[name=xuint]').on('change', update_chart);
    $('input[name=npoint]').on('change', update_chart);
    $('#auto-update').on('change', set_timer);
    set_timer();

    var _arr3 = [0, 1];

    var _loop2 = function _loop2() {
        var yaxis = _arr3[_i3];
        $('#use-logscale-' + yaxis).on('change', function () {
            return update_chart();
        });
        $('#dialog-open-button-' + yaxis).on('click', function () {
            return update_dialog(yaxis);
        });
    };

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        _loop2();
    }

    dialog = {
        log: $('#dialog-log'),
        key: $('#dialog-key'),
        color: $('#dialog-color'),
        yaxis: $('input[name=dialog-yaxis]'),
        button: $('#dialog-button')
    };
    dialog.log.on('change', function () {
        dialog.key.prop('disabled', true);
        dialog.button.prop('disabled', true);

        var id = dialog.log.val();
        if (!id) return;

        var log = monitor.logs.get(id);
        log.sync().then(function () {
            var keys = new Set();
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = log.content[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var entry = _step9.value;
                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = Object.keys(entry)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var key = _step11.value;

                            keys.add(key);
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            dialog.key.empty();
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = keys[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var _key = _step10.value;

                    if (_key == 'iteration' || _key == 'epoch') continue;
                    $('<option></option>').appendTo(dialog.key).attr('value', _key).text(_key);
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                        _iterator10.return();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }

            dialog.key.prop('disabled', false);
        });
    });
    dialog.key.on('click', function () {
        dialog.button.prop('disabled', false);
    });
    dialog.button.on('click', function () {
        var data = {
            log: dialog.log.val(),
            key: dialog.key.val(),
            color: (0, _color.hex2int)(dialog.color.val()),
            yaxis: $('input[name=dialog-yaxis]:checked').val()
        };
        plot.series.add(data).then(update_series);
    });

    plot.sync().then(function () {
        update_series();
        sync_logs();
    });
});

},{"api":1,"color":2}]},{},[3]);