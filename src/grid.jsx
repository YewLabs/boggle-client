import produce from "immer";

import { data } from "./data";

import "./grid.scss";

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      selected: [],
    };
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.handleMouseUp);
  }
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
  }
  handleMouseUp = (e) => {
    this.mouseUp();
  }

  mouseDown = (i) => {
    if (this.state.dragging) return;
    this.setState(
      produce((state) => {
        state.dragging = true;
        state.selected = [i];
      })
    );
    console.log(i);
  };

  mouseMove = (i) => {
    if (!this.state.dragging || this.state.selected.includes(i)) return;
    this.setState(
      produce((state) => {
        state.selected.push(i);
      })
    );
    console.log(i);
  };

  mouseUp = () => {
    console.log(this.state.selected);
    this.setState(
      produce((state) => {
        state.dragging = false;
        state.selected = [];
      })
    );
  };

  render() {
    const circs = data[this.props.level - 1].map(({ cx, cy }, i) => (
      <div
        className={`letter ${
          this.state.selected.includes(i) ? "selected" : ""
        }`}
        key={i}
        onMouseDown={(e) => this.mouseDown(i)}
        onMouseMove={(e) => this.mouseMove(i)}
        style={{ left: cx, top: cy }}
      >
        A
      </div>
    ));

    return (
      <div className={`grid level${this.props.level}`}>
        <img src={`./static/level${this.props.level}.svg`} />
        <div className="letters">{circs}</div>
      </div>
    );
  }
}
