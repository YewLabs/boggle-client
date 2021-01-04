import produce from "immer";

import Level from "./level.jsx";
import Menu from "./menu.jsx";
import { sampleBoard } from "./data";

import "./main.scss";

const OFFLINE_MODE = window.location.host == "localhost:8080";
const urlParams = new URLSearchParams(window.location.search);
// TODO: make sure these are eventually false
const FAKE_SERVER_MODE = new URLSearchParams(window.location.search).has(
  "fakeserver"
);
const SERVER_TEST = false;

const WEBSOCKETS_PROTOCOL = location.protocol === "https:" ? "wss" : "ws";
const WEBSOCKETS_ENDPOINT = OFFLINE_MODE
  ? null
  : FAKE_SERVER_MODE
  ? "ws://krawthekrow.me:29782/ws/puzzle/boggle"
  : `${WEBSOCKETS_PROTOCOL}://${window.location.host}/ws/puzzle/boggle`;

const TICK_INTERVAL = 1000 / 30; // in ms

if (OFFLINE_MODE) {
  console.log("WARNING: offline mode");
}
if (FAKE_SERVER_MODE) {
  console.log("WARNING: fake server mode");
}

const copyIfExists = (state, msg, prop) => {
  if (prop in msg) {
    state[prop] = msg[prop];
  }
};

const mergeWords = (state, msg) => {
  if ("words" in msg) {
    if (state.words == null) {
      state.words = msg["words"];
      return;
    }
    for (const word of msg["words"]) {
      if (!state.words.includes(word)) {
        state.words.push(word);
      }
    }
  }
};

const mergeScore = (state, msg) => {
  if ("score" in msg) {
    if (state.score == null) {
      state.score = msg["score"];
      return;
    }
    if (msg["score"] > state.score) {
      state.score = msg["score"];
    }
  }
};

function mergeTrophies(state, msg) {
  if ("trophies" in msg) {
    if (state.trophies == null) {
      state.trophies = msg["trophies"];
      return;
    }
    state.trophies = [...state.trophies]
      .map((c, i) => {
        const trophy = msg["trophies"][i];
        return trophy == "?" ? c : trophy;
      })
      .join("");
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.ws = null;
    this.timerInterval = null;
    this.stopTimer = null;

    // counter used for synchronization, see server code
    this.numGames = 0;

    this.state = {
      connected: false,
      navigation: "mainmenu",
      running: false,
      maxLevel: 0,
      roundTrophies: 0,
      totNumWords: null,
      level: null,
      timeLeft: null,
      grid: [],
      words: null,
      trophies: null,
      grid: null,
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
      this.setState(
        produce((state) => {
          state.connected = true;
          state.maxLevel = 3;
          state.running = false;
        })
      );
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

      this.requestGetUpdate();
      if (SERVER_TEST) {
        this.requestStart(0);
      }

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
  };
  wsSend = (msg) => {
    const data = JSON.stringify(msg);
    console.log("sending " + data);
    this.ws.send(data);
  };
  handleWsOpen = () => {};
  handleWsClose = () => {
    this.numGames = 0;
    this.setState(
      produce(this.state, (state) => {
        state.connected = false;
      })
    );
  };
  handleWsMessage = (msg) => {
    const msg_type = msg["type"];
    const handlers = {
      full: this.handleFullUpdate,
      grade: this.handleGrade,
    };
    handlers[msg_type](msg);
  };
  requestStart = (level) => {
    this.wsSend({
      type: "start",
      level: level,
    });
  };
  requestGetUpdate = () => {
    this.wsSend({
      type: "getUpdate",
    });
  };
  requestStop = () => {
    this.wsSend({
      type: "stop",
      numGames: this.numGames,
    });
  };
  requestWord = (word) => {
    this.wsSend({
      type: "word",
      numGames: this.numGames,
      word: word,
    });
  };
  checkNumGames = (msg) => {
    const numGamesServer = msg["numGames"];
    if (numGamesServer < this.numGames) {
      console.log("numGames check failed");
      return false;
    }
    this.numGames = numGamesServer;
    return true;
  };
  updateTimeLeft = (msg) => {
    if (!("timeLeft" in msg)) {
      return;
    }
    if (this.stopTimer !== null) {
      clearTimeout(this.stopTimer);
    }
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
    }
    this.stopTimer = setTimeout(this.requestStop, msg["timeLeft"]);
    this.timerInterval = setInterval(() => {
      this.setState(produce(state => {
        state.timeLeft -= TICK_INTERVAL;
      }))
    }, TICK_INTERVAL);
  };
  handleFullUpdate = (msg) => {
    if (!this.checkNumGames(msg)) {
      return;
    }
    this.setState(produce(state => {
      state.connected = true;
      copyIfExists(state, msg, "maxLevel");
      copyIfExists(state, msg, "running");
      copyIfExists(state, msg, "level");
      copyIfExists(state, msg, "timeLeft");
      copyIfExists(state, msg, "totNumWords");
      copyIfExists(state, msg, "roundTrophies");
      copyIfExists(state, msg, "grid");
      mergeScore(state, msg);
      mergeWords(state, msg);
      mergeTrophies(state, msg);

        if (state.running) {
          state.navigation = "mainmenu";
        } else {
          state.score = null;
          state.words = null;
        }
      })
    );
    this.updateTimeLeft(msg);

    if (SERVER_TEST && this.debugStage == 0) {
      this.requestWord("orange");
      this.requestWord("yellow");
      this.requestWord("green");
      this.requestWord("green");
      this.debugStage++;
    }
  };
  handleWrong = () => {
    // only for ui response
  };
  handleDuplicate = () => {
    // only for ui response
  };
  handleCorrect = () => {
    // only for ui response, do not touch word list
  };
  handleGrade = (msg) => {
    [this.handleWrong, this.handleDuplicate, this.handleCorrect][
      msg["grade"]
    ]();
  };
  handleSelectLevel = (level) => {
    if (OFFLINE_MODE) {
      this.setState(produce(state => {
        state.running = true;
        state.level = level;
        state.words = [];
        state.score = 0;
        state.totNumWords = 10;
        state.grid = sampleBoard[level];
        // bitmask indicating which trophies we got
        state.roundTrophies = 0b1100;
      }));
      return;
    }
    this.requestStart(level);
  };
  navigate = (target) => {
    this.setState(
      produce((state) => {
        state.navigation = target;
      })
    );
  };
  handleQuit = () => {
    if (OFFLINE_MODE) {
      this.setState(
        produce((state) => {
          state.running = false;
        })
      );
      return;
    }
    this.requestStop();
  };
  handleWord = (word) => {
    word = word.toLowerCase();
    if (OFFLINE_MODE) {
      this.setState(
        produce((state) => {
          state.words.push(word);
        })
      );
      return;
    }
    this.requestWord(word);
  };
  render() {
    const navigate = (s) => (e) => this.navigate(s);
    const onselectlevel = (level) => (e) => this.handleSelectLevel(level);

    if (!this.state.connected) {
      return <div>Connecting...</div>;
    }
    if (this.state.running) {
      return (
        <Level
          grid={this.state.grid}
          level={`level${this.state.level + 1}`}
          timeleft={this.state.timeLeft}
          totwords={this.state.totNumWords}
          score={this.state.score}
          words={this.state.words}
          onword={this.handleWord}
          onquit={this.handleQuit}
        />
      );
    }

    switch (this.state.navigation) {
      case "mainmenu":
        return <Menu navigate={navigate} onselectlevel={onselectlevel} />;
      case "trophies":
        return <div navigate={navigate} />;
      case "statistics":
        return <div navigate={navigate} />;
      case "leaderboard":
        return <div navigate={navigate} />;
      case "end":
        return <div navigate={navigate} />;
      default:
        return <div>Loading...</div>;
    }
  }
}

const domContainer = document.querySelector("#mainContainer");
ReactDOM.render(<Main />, domContainer);
