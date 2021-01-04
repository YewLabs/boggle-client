export default class Trophies extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="trophies">
        <table>
          {[0, 1, 2, 3].map((i) => (
            <tr key={`row-${i}`}>
              {[0, 1, 2, 3].map((j) => (
                <td key={`${i}-${j}`}>{this.props.trophies[4*i+j]}</td>
              ))}
            </tr>
          ))}
        </table>
        <button onClick={this.props.navigate("mainmenu")}>
          Return to menu
        </button>
      </div>
    );
  }
}
