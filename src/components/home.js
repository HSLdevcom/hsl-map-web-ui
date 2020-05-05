import React from "react";
import classnames from "classnames";
import Header from "./header";
import styles from "./home.module.css";
import { inject, observer } from "mobx-react";
import LineList from "./lineList";

class Home extends React.Component {
  constructor() {
    super();
    this.state = { query: "" };
    this.updateQuery = this.updateQuery.bind(this);
  }

  componentDidMount() {
    this.props.lineStore.clearSelectedLines();
  }

  updateQuery(input) {
    this.setState({
      query: input.target.value,
    });
  }

  lineNumbers = (selectedLines) => {
    return selectedLines.map((line, index) => {
      return index === selectedLines.length - 1
        ? `${line.lineNumber}`
        : `${line.lineNumber}, `;
    });
  };

  handleClick = () => {
    this.props.history.push("/map");
  };

  render() {
    const selectedLines = this.props.lineStore.selectedLines;
    return (
      <div>
        <Header />
        <div className={styles.root}>
          <LineList />
        </div>
        <div className={styles.buttonContainer}>
          <div
            onClick={this.handleClick}
            className={classnames(
              styles.button,
              selectedLines.length > 0 ? null : styles.disabled
            )}>
            Siirry karttanäkymään
          </div>
          {selectedLines.length > 0 && (
            <div className={styles.selectedLineLabels}>
              Valittuna linjat: {this.lineNumbers(selectedLines)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default inject("lineStore")(observer(Home));
