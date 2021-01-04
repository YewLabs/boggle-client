export default class End extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="end">
        <p className="level">Level {this.props.level + 1}</p>
        <p className="points">
          You found {this.props.words} of {this.props.totwords} words, for{" "}
          {this.props.score} points.
        </p>
        {this.props.roundtrophies !== 0 && (
          <p className="trophies">
            You got the trophies: {this.props.roundtrophies}.
          </p>
        )}
        <button onClick={this.props.navigate("mainmenu")}>
          Return to menu
        </button>
      </div>
    );
  }
}
