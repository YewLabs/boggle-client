var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OFFLINE_MODE = window.location.host == "localhost:8080";

var WEBSOCKETS_PROTOCOL = location.protocol === "https:" ? "wss" : "ws";
var WEBSOCKETS_ENDPOINT = OFFLINE_MODE ? null : WEBSOCKETS_PROTOCOL + "://" + window.location.host + "/ws/puzzle/boggle";

if (OFFLINE_MODE) {
  console.log("WARNING: offline mode");
}

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

    _this.ws = null;
    _this.state = {
      navigation: "mainmenu"
    };
    return _this;
  }

  _createClass(Main, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initWs();
    }
  }, {
    key: "initWs",
    value: function initWs() {
      var _this2 = this;

      if (OFFLINE_MODE) {
        return;
      }
      this.ws = new WebSocket(WEBSOCKETS_ENDPOINT);
      this.ws.onopen = function (e) {
        var urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has("token")) {
          // TODO: change this when we migrate to real hunt website
          window.location.href = "../";
        }
        _this2.wsSend({
          "type": "AUTH",
          "data": urlParams.get("token")
        });

        // TESTING
        _this2.wsSend({
          "type": "start",
          "round": 1
        });

        _this2.handleWsOpen();
      };
      this.ws.onmessage = function (e) {
        console.log("received " + e.data);
        var data = JSON.parse(e.data);
        _this2.handleWsMessage(data);
      };
      this.ws.onclose = function (e) {
        _this2.ws = null;
        _this2.handleWsClose();
        _this2.initWs();
      };
    }
  }, {
    key: "wsSend",
    value: function wsSend(msg) {
      var data = JSON.stringify(msg);
      console.log("sending " + data);
      this.ws.send(data);
    }
  }, {
    key: "handleWsOpen",
    value: function handleWsOpen() {}
  }, {
    key: "handleWsClose",
    value: function handleWsClose() {
      // transition to "connecting" state
    }
  }, {
    key: "handleWsMessage",
    value: function handleWsMessage(msg) {}
  }, {
    key: "navigate",
    value: function navigate(target) {
      this.setState({
        navigation: target
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      switch (this.state.navigation) {
        case "mainmenu":
          return React.createElement(
            "div",
            null,
            "Test ",
            React.createElement(
              "button",
              { onClick: function onClick(e) {
                  return _this3.navigate("xxy");
                } },
              "asdf"
            )
          );
        case "xxy":
          return React.createElement(
            "div",
            null,
            "xxy"
          );
        default:
          return React.createElement(
            "div",
            null,
            "Loading..."
          );
      }
    }
  }]);

  return Main;
}(React.Component);

;

var domContainer = document.querySelector("#mainContainer");
ReactDOM.render(React.createElement(Main, null), domContainer);