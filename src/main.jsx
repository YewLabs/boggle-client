class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: "mainmenu",
    };
  }

  navigate = (target) => {
    this.setState({
      navigation: target,
    });
  };

  render() {
    switch (this.state.navigation) {
      case "mainmenu":
        return (
          <div>
            Test <button onClick={(e) => this.navigate("xxy")}>asdf</button>
          </div>
        );
      case "xxy":
        return <div>xxy</div>;
      default:
        return <div>Loading...</div>;
    }
  }
}

const domContainer = document.querySelector("#mainContainer");
ReactDOM.render(<Main />, domContainer);
