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

1. SSH to remote server with port forwarding option
    ```
    [local]$ ssh remote -L 8080:localhost:8080
    ```

2. Start monitor and training
    ```
    [remote]$. /monitor.py
    [remote]$ ./register.py ~/chainer/examples/mnist/result/log --comment mnist
    [remote]$ cd ~/chainer/examples/mnist/
    [remote]$ python train_mnist.py
    ```

3. Open http://localhost:8080/
