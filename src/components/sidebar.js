import React from "react";
import { FiXCircle } from "react-icons/fi";
import { inject, observer } from "mobx-react";
import classnames from "classnames";
import RouteFilter from "./routeFilter";
import LineList from "./lineList";
import LineIcon from "./lineIcon";
import classNames from "classnames";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Header from "./header";
import Notes from "./notes";
import styles from "./sidebar.module.css";

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddLines: false,
    };
  }

  addLines = (selectedLines) => {
    this.setState({ showAddLines: false });
    this.props.onAddLines(selectedLines);
    this.props.lineStore.setSelectedLines([]);
  };

  getSelectedLineShortIds = (selectedLines) => {
    let shortIds = "";
    selectedLines.forEach((line, index) => {
      const shortId =
        index === selectedLines.length - 1 ? line.lineNumber : `${line.lineNumber}, `;
      shortIds = `${shortIds}${shortId}`;
    });
    return shortIds;
  };

  render() {
    const selectedLines = this.props.lineStore.getSelectedLines;
    const headerIcon = (
      <div
        onClick={() => {
          this.setState({ showAddLines: !this.state.showAddLines });
        }}>
        {this.state.showAddLines ? (
          <FiChevronUp className={styles.dropdownButton} />
        ) : (
          <FiChevronDown className={styles.dropdownButton} />
        )}
      </div>
    );
    return (
      <div className={styles.root}>
        <Header />
        <div className={styles.addLineTitleContainer}>
          <div className={styles.addLineTitle}>Lisää linjoja</div>
          {headerIcon}
        </div>
        <div
          className={classNames(
            styles.sideBarLineList,
            this.state.showAddLines ? "" : styles.hidden
          )}>
          {this.state.showAddLines && <LineList hideTitle resetSelection />}
        </div>
        <div
          onClick={() => this.addLines(selectedLines)}
          className={classnames(
            styles.button,
            selectedLines.length > 0 ? null : styles.disabled,
            this.state.showAddLines ? "" : styles.buttonHidden
          )}>
          {selectedLines.length < 1
            ? "Valitse linjoja"
            : `Lisää linjat: ${this.getSelectedLineShortIds(selectedLines)}`}
        </div>
        {this.state.showAddLines && <div className={styles.divider} />}
        {this.props.lines.map((line, index) => {
          return (
            <div key={index} className={styles.elementContainer}>
              <div className={styles.headerContainer}>
                <LineIcon
                  transportType={line.transportType}
                  shortName={line.lineNumber}
                  lineNameFi={line.lineNameFi}
                  iconSize="24"
                  additionalStyle={{ marginBottom: "15px" }}
                />
                <div className={styles.removeButtonContainer}>
                  <FiXCircle
                    onClick={() =>
                      this.props.lines.length > 1
                        ? this.props.removeSelectedLine(line)
                        : ""
                    }
                    className={
                      this.props.lines.length > 1 ? styles.icon : styles.iconDisabled
                    }
                  />
                </div>
              </div>
              <div id="map-container">
                <RouteFilter
                  transportType={line.transportType}
                  routes={line.routes}
                  selectedRoutes={this.props.selectedRoutes}
                  toggleChecked={this.props.toggleChecked}
                  isFullScreen={this.props.isFullScreen}
                  showFilter={this.props.showFilter}
                  toggleFilter={this.props.toggleFilter}
                  setMapCenter={this.props.setMapCenter}
                />
              </div>
              <Notes notes={line.notes} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default inject("lineStore")(observer(Sidebar));
