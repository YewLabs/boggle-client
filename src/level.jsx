export default class Level extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="level">
        <button className="gray" onClick={this.props.navigate("mainmenu")}>Quit</button>
        <img src="./static/level1.png" />
        {this.props.level}
      </div>
    );
  }
}
