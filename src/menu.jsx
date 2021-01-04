export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="menu">
        <div className="levels">
          <div className="levels-buttons">
          <p>Play:</p>
            <button onClick={this.props.navigate(0)}>Level 1</button>
            <button onClick={this.props.navigate(1)}>Level 2</button>
            <button onClick={this.props.navigate(2)}>Level 3</button>
            <button onClick={this.props.navigate(3)}>Level 4</button>
          </div>
        </div>
        <div className="etc">
          <button onClick={this.props.navigate("trophies")}>Trophies</button>
          <button onClick={this.props.navigate("statistics")}>
            Statistics
          </button>
          <button onClick={this.props.navigate("leaderboard")}>
            Leaderboard
          </button>
        </div>
      </div>
    );
  }
}
