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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var monitor = new _api2.default('./api');

var Button = ReactBootstrap.Button;
var Clearfix = ReactBootstrap.Clearfix;
var FormControl = ReactBootstrap.FormControl;
var Navbar = ReactBootstrap.Navbar;
var Panel = ReactBootstrap.Panel;
var Table = ReactBootstrap.Table;

var Navbar_ = function (_React$Component) {
    _inherits(Navbar_, _React$Component);

    function Navbar_() {
        _classCallCheck(this, Navbar_);

        return _possibleConstructorReturn(this, (Navbar_.__proto__ || Object.getPrototypeOf(Navbar_)).apply(this, arguments));
    }

    _createClass(Navbar_, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                Navbar,
                null,
                React.createElement(
                    Navbar.Header,
                    null,
                    React.createElement(
                        Navbar.Brand,
                        null,
                        React.createElement(
                            'a',
                            { href: '#' },
                            'Monitor'
                        )
                    )
                )
            );
        }
    }]);

    return Navbar_;
}(React.Component);

var PlotList = function (_React$Component2) {
    _inherits(PlotList, _React$Component2);

    function PlotList(props) {
        _classCallCheck(this, PlotList);

        var _this2 = _possibleConstructorReturn(this, (PlotList.__proto__ || Object.getPrototypeOf(PlotList)).call(this, props));

        _this2.plots = props.plots;
        _this2.state = { comment: '' };
        return _this2;
    }

    _createClass(PlotList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            this.plots.sync().then(function () {
                return _this3.setState();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var header = React.createElement(
                'h3',
                null,
                'Plot',
                React.createElement(
                    'form',
                    { className: 'form-inline pull-right' },
                    React.createElement(FormControl, {
                        type: 'text',
                        value: this.state.comment,
                        placeholder: 'comment',
                        onChange: function onChange(e) {
                            return _this4.setState({ comment: e.target.value });
                        } }),
                    React.createElement(
                        Button,
                        {
                            bsStyle: 'primary',
                            onClick: function onClick() {
                                return _this4.plots.add({ comment: _this4.state.comment }).then(function () {
                                    return _this4.setState({ comment: '' });
                                });
                            }
                        },
                        'Add'
                    )
                ),
                React.createElement(Clearfix, null)
            );

            var rows = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var plot = _step.value;

                    rows.push(React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'a',
                                { href: './plot.html?' + plot.id },
                                plot.comment != '' ? plot.comment : '<no comment>'
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                Button,
                                {
                                    bsStyle: 'danger',
                                    bsSize: 'small',
                                    className: 'pull-right',
                                    onClick: function onClick() {
                                        return _this4.plots.remove(plot).then(function () {
                                            return _this4.setState();
                                        });
                                    }
                                },
                                'Delete'
                            )
                        )
                    ));
                };

                for (var _iterator = this.plots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

            return React.createElement(
                Panel,
                { header: header },
                React.createElement(
                    Table,
                    { fill: true },
                    React.createElement(
                        'tbody',
                        null,
                        rows
                    )
                )
            );
        }
    }]);

    return PlotList;
}(React.Component);

var LogList = function (_React$Component3) {
    _inherits(LogList, _React$Component3);

    function LogList(props) {
        _classCallCheck(this, LogList);

        var _this5 = _possibleConstructorReturn(this, (LogList.__proto__ || Object.getPrototypeOf(LogList)).call(this, props));

        _this5.logs = props.logs;
        return _this5;
    }

    _createClass(LogList, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this6 = this;

            this.logs.sync().then(function () {
                return _this6.setState();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            var header = React.createElement(
                'h3',
                null,
                'Log'
            );

            var rows = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var log = _step2.value;

                    rows.push(React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            log.path
                        ),
                        React.createElement(
                            'td',
                            null,
                            log.comment
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                Button,
                                {
                                    bsStyle: 'danger',
                                    bsSize: 'small',
                                    className: 'pull-right',
                                    onClick: function onClick() {
                                        return _this7.logs.remove(log).then(function () {
                                            return _this7.setState();
                                        });
                                    }
                                },
                                'Delete'
                            )
                        )
                    ));
                };

                for (var _iterator2 = this.logs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

            return React.createElement(
                Panel,
                { header: header },
                React.createElement(
                    Table,
                    { fill: true },
                    React.createElement(
                        'tbody',
                        null,
                        rows
                    )
                )
            );
        }
    }]);

    return LogList;
}(React.Component);

var App = function (_React$Component4) {
    _inherits(App, _React$Component4);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'container' },
                React.createElement(Navbar_, null),
                React.createElement(PlotList, { plots: monitor.plots }),
                React.createElement(LogList, { logs: monitor.logs })
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

},{"api":1}]},{},[2]);
