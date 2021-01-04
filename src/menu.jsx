export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const buttons = [];
    for (let i = 0; i < 4; i++) {
      buttons.push(<button key={i} onClick={this.props.onselectlevel(i)} disabled={i > this.props.maxlevel}>Level {i+1}</button>);
    }
    return (
      <div className="menu">
        <div className="levels">
          <div className="levels-buttons">
          <p>Play:</p>
            { buttons }
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
