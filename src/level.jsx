import produce from "immer";

import Grid from "./grid.jsx";

import "./level.scss";

const BarTimer = ({ timeleft, tottime }) => {
  const width = Math.max((100 * timeleft) / tottime, 0);
  const totSeconds = Math.floor(timeleft / 1000);
  const minutes = Math.floor(totSeconds / 60);
  const seconds = totSeconds - minutes * 60;

  return (
    <div className="bartimer" style={{ width: `${width}%` }}>
      <span className="time">{`${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`}</span>
    </div>
  );
};

export default class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      time: 0,
      value: "",
    };
    this.submitBox = null;
    this.submittedWords = {};
  }

  componentDidMount() {
    this.focusInput();
  }

  focusInput = () => {
    this.submitBox.focus({ preventScroll: true });
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
      this.submittedWords[this.state.value] = true;
    }
    this.setState(
      produce((state) => {
        state.value = "";
      })
    );
  };

  render() {
    let inputClassName = "";
    let inputCallback = () => {};
    let repeatedWord = "";
    let correctWord = "";
    let wordCallback = () => {};
    this.props.wordresponses?.forEach(({ word, response, fulfilled }) => {
      if (word in this.submittedWords) {
        const callback = () => {
          inputClassName = "";
          repeatedWord = "";
          delete this.submittedWords[word];
          fulfilled();
          this.render();
        };
        if (response === "wrong") {
          inputClassName = "wrong";
          inputCallback = callback;
        } else if (response === "duplicate") {
          repeatedWord = word;
          wordCallback = callback;
        } else {
          correctWord = word;
          wordCallback = callback;
        }
      }
    });

    return (
      <div className="level">
        <div className="toolbar">
          <button className="gray" onClick={this.props.onquit}>
            Quit
          </button>
          <div className="timerwrapper">
            <BarTimer
              timeleft={this.props.timeleft}
              tottime={this.props.tottime}
            />
          </div>
          <span className="score">
            Words: {this.props.words.length} of {this.props.totwords}
            <br />
            Score: {this.props.score}
          </span>
        </div>
        <Grid
          grid={this.props.grid}
          bonuses={this.props.bonuses}
          level={this.props.level.slice(-1)}
          submit={this.props.onword}
          wordresponses={this.props.wordresponses}
          refocus={this.focusInput}
        />
        <div className="inputs">
          <div className="words">
            {this.props.words.map((w, i) => {
              const isSpecial =
                this.props.special != null && w[0] == this.props.special;
              return (
                <span
                  key={w[0]}
                  className={
                    isSpecial
                      ? "special"
                      : (w[0] in this.props.wordresponsesd)
                      ? this.props.wordresponsesd[w[0]]
                      : ""
                  }
                  onAnimationEnd={(e) => wordCallback?.()}
                >
                  <span
                    className={`
                    score
                    ${w[1].toString().length > 3 ? "small" : ""}
                    `}
                  >
                    {w[1]}
                  </span>{" "}
                  {w[0]}
                </span>
              );
            })}
          </div>
          <form onSubmit={this.onInput}>
            <input
              className={inputClassName}
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
              ref={(el) => {
                this.submitBox = el;
              }}
              onAnimationEnd={(e) => inputCallback?.()}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }
}
