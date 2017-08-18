'use strict';

import Monitor from "api";
const monitor = new Monitor('./api');

const Button = ReactBootstrap.Button;
const Clearfix = ReactBootstrap.Clearfix;
const FormControl = ReactBootstrap.FormControl;
const Navbar = ReactBootstrap.Navbar;
const Panel = ReactBootstrap.Panel;
const Table = ReactBootstrap.Table;

class Navbar_ extends React.Component {
    render() {
        return (
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">Monitor</a>
                </Navbar.Brand>
              </Navbar.Header>
            </Navbar>
        );
    }
}

class PlotList extends React.Component {
    constructor(props) {
        super(props);
        this.plots = props.plots;
        this.state = {comment: ''};
    }

    componentDidMount() {
        this.plots.sync()
            .then(() => this.setState());
    }

    render() {
        const header = (
            <h3>
              Plot
              <form className="form-inline pull-right">
                <FormControl
                  type="text"
                  value={this.state.comment}
                  placeholder="comment"
                  onChange={(e) => this.setState({comment: e.target.value})}/>
                  <Button
                    bsStyle="primary"
                    onClick={() =>
                             this.plots.add({comment: this.state.comment})
                             .then(() => this.setState({comment: ''}))}
                             >Add</Button>
              </form>
              <Clearfix/>
            </h3>
        );

        const rows = [];
        for (const plot of this.plots) {
            rows.push(
                <tr>
                  <td>{(plot.comment != '') ? plot.comment : '<no comment>'}</td>
                  <td>
                    <Button
                      bsStyle="danger"
                      bsSize="small"
                      className="pull-right"
                      onClick={() =>
                               this.plots.remove(plot)
                               .then(() => this.setState())}
                               >Delete</Button>
                  </td>
                </tr>
            );
        }

        return (
            <Panel header={header}>
              <Table fill><tbody>{rows}</tbody></Table>
            </Panel>
        );
    }
}

class LogList extends React.Component {
    constructor(props) {
        super(props);
        this.logs = props.logs;
    }

    componentDidMount() {
        this.logs.sync()
            .then(() => this.setState());
    }

    render() {
        const header = (<h3>Log</h3>);

        const rows = [];
        for (const log of this.logs) {
            rows.push(
                <tr>
                  <td>{log.path}</td>
                  <td>{log.comment}</td>
                  <td>
                    <Button
                      bsStyle="danger"
                      bsSize="small"
                      className="pull-right"
                      onClick={() =>
                               this.logs.remove(plot)
                               .then(() => this.setState())}
                               >Delete</Button>
                  </td>
                </tr>
            );
        }

        return (
            <Panel header={header}>
              <Table fill><tbody>{rows}</tbody></Table>
            </Panel>
        );
    }
}


class App extends React.Component {
    render() {
        return (
            <div className='container'>
              <Navbar_/>
              <PlotList plots={monitor.plots}/>
              <LogList logs={monitor.logs}/>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
