import produce from "immer";

export default class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleChange = (e) => {
    this.setState(
      produce((state) => {
        state.value = e.target.value;
      })
    );
  };

  submit = (e) => {
    e.preventDefault();
    console.log(this.state.value);
    this.setState(
      produce((state) => {
        state.value = "";
      })
    );
  };

  render() {
    return (
      <div className="level">
        <div className="toolbar">
          <button className="gray" onClick={this.props.navigate("mainmenu")}>
            Quit
          </button>
          <span className="score">Score: 0</span>
          <span className="time">Time: 25</span>
        </div>
        <div className="grid">
          <img src="./static/level4.png" />
        </div>
        <div>
          <div className="words"></div>
          <form onSubmit={this.submit}>
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
            />
            <button type="submit">send</button>
          </form>
        </div>
      </div>
    );
  }
}
