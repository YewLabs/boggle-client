import Level from "./level.jsx";
import Menu from "./menu.jsx";

import "./main.scss";

const OFFLINE_MODE = window.location.host == "localhost:8080";

const WEBSOCKETS_PROTOCOL = location.protocol === "https:" ? "wss" : "ws";
const WEBSOCKETS_ENDPOINT = OFFLINE_MODE
  ? null
  : `${WEBSOCKETS_PROTOCOL}://${window.location.host}/ws/puzzle/boggle`;

if (OFFLINE_MODE) {
  console.log("WARNING: offline mode");
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.state = {
      navigation: "mainmenu",
    };
  }
  componentDidMount() {
    this.initWs();
  }
  initWs() {
    if (OFFLINE_MODE) {
      return;
    }
    this.ws = new WebSocket(WEBSOCKETS_ENDPOINT);
    this.ws.onopen = (e) => {
      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.has("token")) {
        // TODO: change this when we migrate to real hunt website
        window.location.href = "../";
      }
      this.wsSend({
        type: "AUTH",
        data: urlParams.get("token"),
      });

      // TESTING
      this.wsSend({
        type: "start",
        round: 1,
      });

      this.handleWsOpen();
    };
    this.ws.onmessage = (e) => {
      console.log("received " + e.data);
      const data = JSON.parse(e.data);
      this.handleWsMessage(data);
    };
    this.ws.onclose = (e) => {
      this.ws = null;
      this.handleWsClose();
      this.initWs();
    };
  }
  wsSend(msg) {
    const data = JSON.stringify(msg);
    console.log("sending " + data);
    this.ws.send(data);
  }
  handleWsOpen() {}
  handleWsClose() {
    // transition to "connecting" state
  }
  handleWsMessage(msg) {}
  navigate(target) {
    this.setState({
      navigation: target,
    });
  }
  render() {
    const navigate = (s) => (e) => this.navigate(s);

    switch (this.state.navigation) {
      case "mainmenu":
        return <Menu navigate={navigate} />;
      case "level1":
      case "level2":
      case "level3":
      case "level4":
        return <Level navigate={navigate} level={this.state.navigation} />;
      case "trophies":
        return <div navigate={navigate} />;
      case "statistics":
        return <div navigate={navigate} />;
      case "leaderboard":
        return <div navigate={navigate} />;
      default:
        return <div>Loading...</div>;
    }
  }
}

const domContainer = document.querySelector("#mainContainer");
ReactDOM.render(<Main />, domContainer);
