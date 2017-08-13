# chainer-monitor

Simple visualizer for Chainer's log.

## Requirements
- Python 3
- bottle (avaiable via pip)

## Usage

1. Start monitor
```
$ cd chainer-monitor
$ ./monitor.py
```

2. Register a log file.
```
$ ./register.py <log file> [--comment <comment>]
```
For example,
```
$ ./register.py ~/chainer/examples/mnist/result/log --comment mnist
```

3. Open http://localhost:8080/ with your web browser.
