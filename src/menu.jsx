import produce from "immer";

import { trophyDescriptions } from "./data";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
    };
  }

  setDescription = (i, j) => {
    this.setState(
      produce((state) => {
        state.description = trophyDescriptions[i][j];
      })
    );
  };

  render() {
    const buttons = [];
    for (let i = 0; i < 4; i++) {
      buttons.push(
        <button
          key={i}
          onClick={this.props.onselectlevel(i)}
          disabled={i > this.props.maxlevel}
        >
          Level {i + 1}
        </button>
      );
    }
    return (
      <div className="menu">
        <div className="play">{buttons}</div>
        <div className="trophies">
          {[0, 1, 2, 3].map((i) =>
            [0, 1, 2, 3].map((j) => {
              const letter = this.props.trophies[4 * i + j];
              return (
                <div
                  className="trophy"
                  key={`${i}-${j}`}
                  onMouseOver={(e) => this.setDescription(i, j)}
                >
                  <div className="stand"></div>
                  {letter !== "?" && (
                    <img src="./static/trophy.svg" draggable="false" />
                  )}
                  <span className="letter">{letter}</span>
                </div>
              );
            })
          )}
        </div>
        <button
          className="statistics"
          onClick={this.props.navigate("statistics")}
        >
          Statistics
        </button>
        <div className="description">{this.state.description}</div>
        {this.props.blanks && (
          <React.Fragment>
            <button
              className="leaderboard"
              onClick={this.props.navigate("leaderboard")}
            >
              Leaderboard
            </button>
            <div className="blanks">{this.props.blanks}</div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
