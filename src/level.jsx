import produce from "immer";

import Grid from "./grid.jsx";

import "./level.scss";

export default class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      time: 0,
      value: "",
    };
    this.submitBox = null;
  }

  componentDidMount() {
    this.focusInput();
  }

  focusInput = () => {
    this.submitBox.focus();
  };

  handleChange = (e) => {
    this.setState(
      produce((state) => {
        state.value = e.target.value;
      })
    );
  };

  onInput = (e) => {
    e.preventDefault();
    if (this.state.value !== "") {
      this.props.onword(this.state.value);
    }
    this.setState(
      produce((state) => {
        state.value = "";
      })
    );
  };

  niceTime = () => {
    const totSeconds = Math.floor(this.props.timeleft / 1000);
    const minutes = Math.floor(totSeconds / 60);
    const seconds = totSeconds - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  render() {
    const width = Math.max((100 * this.props.timeleft) / this.props.tottime, 0);
    return (
      <div className="level">
        <div className="toolbar">
          <button className="gray" onClick={this.props.onquit}>
            Quit
          </button>
          <div className="timerwrapper">
            <div className="bartimer" style={{ width: `${width}%` }}>
              <span className="time">{this.niceTime()}</span>
            </div>
          </div>
          <span className="score">
            Words: {this.props.words.length} of {this.props.totwords}
            <br />
            Score: {this.props.score}
          </span>
        </div>
        <Grid
          grid={this.props.grid}
          level={this.props.level.slice(-1)}
          submit={this.props.onword}
          wordresponses={this.props.wordresponses}
          refocus={this.focusInput}
        />
        <div className="inputs">
          <div className="words">
            {this.props.words.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <form onSubmit={this.onInput}>
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
              ref={(el) => {
                this.submitBox = el;
              }}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }
}
