import React from "react";
import classnames from "classnames";
import Header from "./header";
import styles from "./home.module.css";
import { isMobile } from "../utils/browser";
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
      const type = line.transportType;
      return (
        <div key={index} className={styles.row}>
          <div
            className={classnames(styles.lineNumber, {
              [styles.tram]: type === "tram",
              [styles.bus]: type !== "tram",
              [styles.trunk]: line.trunkRoute,
            })}>
            {line.lineNumber}
          </div>
          <div className={styles.comma}>
            {index === selectedLines.length - 1 ? `` : `,`}
          </div>
        </div>
      );
    });
  };

  handleClick = () => {
    const selectedLines = this.props.lineStore.selectedLines;
    let params = "?";
    selectedLines.forEach((selectedLine, index) => {
      const and = index === selectedLines.length - 1 ? "" : "&";
      const lineId = selectedLine.lineId;
      params = `${params}${lineId}[dateBegin]=${selectedLine.dateBegin}&${lineId}[dateEnd]=${selectedLine.dateEnd}${and}`;
    });
    this.props.history.push(`/map/${params}`);
  };

  render() {
    const selectedLines = this.props.lineStore.selectedLines;
    return (
      <div>
        <Header />
        <div className={classnames(styles.root, isMobile ? styles.rootMobile : null)}>
          <LineList isMobile={isMobile} frontpage={true} />
        </div>
        <div
          className={classnames(
            styles.buttonContainer,
            isMobile ? styles.buttonContainerMobile : null
          )}>
          <div
            onClick={this.handleClick}
            className={classnames(
              styles.button,
              selectedLines.length > 0 ? null : styles.disabled,
              isMobile ? styles.buttonMobile : null
            )}>
            Siirry karttanäkymään
          </div>
          {selectedLines.length > 0 && (
            <div className={styles.selectedLineLabels}>
              <div className={styles.linesTitle}>Valittuna linjat:</div>
              {this.lineNumbers(selectedLines)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default inject("lineStore")(observer(Home));
