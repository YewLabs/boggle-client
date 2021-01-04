import produce from "immer";

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

const copyIfExists = (state, msg, prop) => {
  if (prop in msg) {
    state[prop] = msg[prop];
  }
}

const mergeWords = (state, msg) => {
  if ('words' in msg) {
    if (state.words == null) {
      state.words = msg['words'];
      return;
    }
    for (const word of msg['words']) {
      if (!state.words.includes(word)) {
        state.words.push(word);
      }
    }
  }
}

const mergeScore = (state, msg) => {
  if ('score' in msg) {
    if (state.score == null) {
      state.score = msg['score'];
      return;
    }
    if (msg['score'] > state.score) {
      state.score = msg['score'];
    }
  }
}

function mergeTrophies(state, msg) {
  if ('trophies' in msg) {
    if (state.trophies == null) {
      state.trophies = msg['trophies'];
      return;
    }
    state.trophies = [...state.trophies].map((c, i) => {
      const trophy = msg['trophies'][i];
      return (trophy == '?') ? c : trophy;
    }).join('');
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.ws = null;
    this.stopTimer = null;

    // counter used for synchronization, see server code
    this.numGames = 0;

    this.state = {
      connected: false,
      navigation: "mainmenu",
      running: false,
      maxLevel: 0,
      level: null,
      timeLeft: null,
      words: null,
      trophies: null,
    };

    // FOR DEBUGGING ONLY
    window.main = this;
    this.debugStage = 0;
  }
  componentDidMount() {
    this.initWs();
  }
  initWs = () => {
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
      this.requestStart(0);

      this.handleWsOpen();
    };
    this.ws.onmessage = (e) => {
      console.log("received " + e.data);
      const data = JSON.parse(e.data);
      this.handleWsMessage(data);
    };
    this.ws.onclose = (e) => {
      this.handleWsClose();
      this.initWs();
    };
  }
  wsSend = (msg) => {
    const data = JSON.stringify(msg);
    console.log("sending " + data);
    this.ws.send(data);
  }
  handleWsOpen = () => {}
  handleWsClose = () => {
    this.numGames = 0;
    this.setState(produce(this.state, state => {
      state.connected = false;
    }));
  }
  handleWsMessage = (msg) => {
    const msg_type = msg['type'];
    const handlers = {
      "full": this.handleFullUpdate.bind(this),
      "grade": this.handleGrade,
    };
    handlers[msg_type](msg);
  }
  requestStart = (level) => {
    this.wsSend({
      "type": "start",
      "level": level,
    });
  }
  requestStop = () => {
    this.wsSend({
      "type": "stop",
      "numGames": this.numGames,
    });
  }
  requestWord = (word) => {
    this.wsSend({
      "type": "word",
      "numGames": this.numGames,
      "word": word,
    });
  }
  checkNumGames = (msg) => {
    const numGamesServer = msg['numGames'];
    if (numGamesServer < this.numGames) {
      console.log('numGames check failed');
      return false;
    }
    this.numGames = numGamesServer;
    return true;
  }
  updateTimeLeft = (msg) => {
    if (!('timeLeft' in msg)) {
      return;
    }
    if (this.stopTimer != null) {
      clearTimeout(this.stopTimer);
    }
    this.stopTimer = setTimeout(this.requestStop.bind(this), msg['timeLeft']);
  }
  handleFullUpdate = (msg) => {
    if (!this.checkNumGames(msg)) {
      return;
    }
    this.setState(produce(state => {
      state.connected = true;
      copyIfExists(state, msg, 'maxLevel');
      copyIfExists(state, msg, 'running');
      copyIfExists(state, msg, 'level');
      copyIfExists(state, msg, 'timeLeft');
      mergeScore(state, msg);
      mergeWords(state, msg);
      mergeTrophies(state, msg);
    }));
    this.updateTimeLeft(msg);

    if (this.debugStage == 0) {
      this.requestWord('orange');
      this.requestWord('yellow');
      this.requestWord('green');
      this.requestWord('green');
      this.debugStage++;
    }
  }
  handleGrade = (msg) => {
  }
  navigate = (target) => {
    this.setState(produce(state => {
      state.navigation = target;
    }));
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
