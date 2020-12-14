import { Component, createRef } from "react";
import "./style.css";

class Tab extends Component {
  constructor(props) {
    super(props);
    this.elm = createRef();
  }

  componentDidUpdate() {
    if (this.props.isSelected) {
      this.elm.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  render() {
    const { title, isSelected, onClose, selectTab } = this.props;
    return (
      <div
        ref={this.elm}
        className={`Tab ${isSelected ? "selected" : ""}`}
        onClick={selectTab}
      >
        <div
          className={`${!isSelected ? "close" : "hidden"}`}
          onClick={onClose}
        >
          &#10005;
        </div>
        {title}
      </div>
    );
  }
}

export default Tab;
