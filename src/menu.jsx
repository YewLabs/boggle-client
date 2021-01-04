export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const buttons = [];
    for (let i = 0; i < 4; i++) {
      buttons.push(
        <button
          key={i}
          onClick={this.props.onselectlevel(i)}
          disabled={i > this.props.maxlevel}
        >
          {i + 1}
        </button>
      );
    }
    return (
      <div className="menu">
        <div className="label-play">Play:</div>
        <div className="label-trophies">Trophies:</div>
        <div className="play">{buttons}</div>
        <div className="trophies">
          {[0, 1, 2, 3].map((i) =>
            [0, 1, 2, 3].map((j) => (
              <div className="trophy" key={`${i}-${j}`}>
                {this.props.trophies[4 * i + j]}
              </div>
            ))
          )}
        </div>
        <button
          className="statistics"
          onClick={this.props.navigate("statistics")}
        >
          Statistics
        </button>
        <div className="description">description</div>
        <button
          className="leaderboard"
          onClick={this.props.navigate("leaderboard")}
        >
          Leaderboard
        </button>
        <div className="blanks">_ _ _ _ _ _ _ _ _ _   _ _ _ _ _ _</div>
      </div>
    );
  }
}
