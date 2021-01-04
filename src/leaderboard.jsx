export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="leaderboard">
        <button onClick={this.props.navigate("mainmenu")}>
          Return to menu
        </button>
      </div>
    );
  }
}
