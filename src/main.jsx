class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>Test</div>;
  }
}

const domContainer = document.querySelector("#mainContainer");
ReactDOM.render(<Main />, domContainer);
