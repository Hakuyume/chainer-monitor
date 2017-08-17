# chainer-monitor

Simple visualizer for Chainer's log.

[Demo](https://hakuyume.github.io/chainer-monitor/)

## Requirements
- Python 3
- bottle (avaiable via pip)

## Usage

1. Start monitor
    ```
    $ cd chainer-monitor
    $ git checkout release
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


## Advanced usage

### Use multiple workers for performance

```
$ pip install -U gunicorn
$ gunicorn monitor:app --bind :8080 --workers 4
```

### Training on remote server, viewing from local machine.

- @ remote server
    ```
    $ ./monitor.py
    $ ./register.py ~/chainer/examples/mnist/result/log --comment mnist
    $ cd ~/chainer/examples/mnist/
    $ python train_mnist.py
    ```

- @ local machine
    ```
    $ ssh remote -L 8080:localhost:8080
    ```
    Open http://localhost:8080/
