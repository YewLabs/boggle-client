const HISCORE_SCALE = 100000;

export default class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let contents = <div>Loading...</div>;
    if (this.props.hiscores != null) {
      contents = [];
      for (const entry of this.props.hiscores) {
        contents.push(<div key={entry[0]}>{entry[0]} {entry[1] / HISCORE_SCALE * 100}%</div>);
      }
    }
    const buttons = [];
    for (let i = 0; i < 4; i++) {
      if (i <= this.props.maxlevel) {
        buttons.push(<button key={i} onClick={(e) => {this.props.onlevel(i)}}>{i+1}</button>);
      }
    }
    return (
      <div className="leaderboard">
        <button onClick={this.props.navigate("mainmenu")}>
          Return to menu
        </button>
        { buttons }
        { contents }
      </div>
    );
  }
}
