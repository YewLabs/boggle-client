import produce from "immer";

export default class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      time: 0,
      totalWords: 25,
      value: "",
      words: [],
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
    this.setState(
      produce((state) => {
        state.words.push(this.state.value);
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
          <span className="time">Time: {this.state.time}</span>
          <span className="score">
            Words: {this.state.words.length} of {this.state.totalWords}
          </span>
        </div>
        <div className="grid">
          <img src="./static/level4.png" />
        </div>
        <div className="inputs">
          <div className="words">
            {this.state.words.map((w) => (
              <span>{w}</span>
            ))}
          </div>
          <form onSubmit={this.submit}>
            <input
              onChange={this.handleChange}
              type="text"
              value={this.state.value}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }
}
