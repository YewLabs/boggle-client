import produce from "immer";

import { data, adjacent } from "./data";

import "./grid.scss";

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      selected: [],
      last: {},
    };
    this.lettersOf = {};
    this.globalFulfilled = false;
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
  }
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
  }
  handleMouseUp = (e) => {
    this.mouseUp();
    this.props.refocus();
  };

  mouseDown = (i, pt) => {
    if (this.state.dragging) return;
    this.setState(
      produce((state) => {
        state.dragging = true;
        state.selected = [i];
        state.last = pt;
      })
    );
  };

  mouseMove = (i, pt) => {
    if (
      !this.state.dragging ||
      this.state.selected.includes(i) ||
      !adjacent[this.props.level - 1](this.state.last)(pt)
    )
      return;
    this.setState(
      produce((state) => {
        state.selected.push(i);
        state.last = pt;
      })
    );
  };

  mouseUp = () => {
    const word = this.state.selected
      .map((i) => {
        const { x, y, z } = data[this.props.level - 1][i];
        return z === undefined
          ? this.props.grid[x][y]
          : this.props.grid[x][y][z];
      })
      .join("");
    if (word !== "") {
      this.props.submit(word);
      this.lettersOf[word] = this.state.selected;
    }
    this.setState(
      produce((state) => {
        state.dragging = false;
        state.selected = [];
      })
    );
  };

  render() {
    let responses = {};
    let callbacks = {};
    let globalResponse = "";
    let globalCallback = () => {};
    this.props.wordresponses?.forEach(({ word, response, fulfilled }) => {
      if (word in this.lettersOf) {
        this.lettersOf[word].forEach((i) => {
          responses[i] = response;
          callbacks[i] = () => {
            delete this.lettersOf[word];
            fulfilled();
          };
        });
      } else {
        globalResponse = response;
        this.globalFulfilled = false;
        globalCallback = () => {
          if (this.globalFulfilled) return;
          fulfilled();
          this.globalFulfilled = true;
        };
      }
    });

    const circs = data[this.props.level - 1].map(({ x, y, z, cx, cy }, i) => (
      <div
        className={`letter
          ${this.state.selected.includes(i) ? "selected" : ""}
          ${this.state.selected.slice(-1)[0] === i ? "last" : ""}
          ${globalResponse}
          ${responses[i] ?? ""}
        `}
        key={i}
        onMouseDown={(e) => this.mouseDown(i, { x, y, z })}
        onMouseMove={(e) => this.mouseMove(i, { x, y, z })}
        onAnimationEnd={(e) => callbacks?.[i]?.() || globalCallback()}
        style={{ left: cx, top: cy }}
      >
        {z === undefined ? this.props.grid[x][y] : this.props.grid[x][y][z]}
      </div>
    ));

    return (
      <div className={`grid level${this.props.level}`}>
        <img src={`./static/level${this.props.level}.svg`} draggable="false" />
        <div className="letters">{circs}</div>
      </div>
    );
  }
}
