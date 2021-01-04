export default class Statistics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="statistics">
        <button onClick={this.props.navigate("mainmenu")}>
          Return to menu
        </button>
      </div>
    );
  }
}
