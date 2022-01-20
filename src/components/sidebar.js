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
    const sliderBackgroundColor = this.props.showPrintLayout ? "#006db6" : "#d3d3d3";
    const headerIcon = (
      <div>
        {this.state.showAddLines ? (
          <FiChevronUp className={styles.dropdownButton} />
        ) : (
          <FiChevronDown className={styles.dropdownButton} />
        )}
      </div>
    );
    const sortedLines = this.props.lines.sort((a, b) => {
      const transportTypeOrder = ["tram", "bus"];
      if (a.transportType !== b.transportType) {
        return transportTypeOrder.indexOf(a.transportType) >
          transportTypeOrder.indexOf(b.transportType)
          ? 1
          : -1;
      } else if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
        return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
      } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
        return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
      }
      return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
    });
    return (
      <div className={this.props.isFullScreen ? styles.hideRoot : styles.root}>
        <Header />
        <div
          className={styles.addLineTitleContainer}
          onClick={() => {
            this.setState({ showAddLines: !this.state.showAddLines });
          }}>
          <div className={styles.addLineTitle}>Lisää linjoja</div>
          {headerIcon}
        </div>
        <div
          className={classNames(
            styles.sideBarLineList,
            this.state.showAddLines ? "" : styles.hidden
          )}>
          {this.state.showAddLines && (
            <LineList hideTitle ignoredLines={this.props.lines} />
          )}
        </div>
        <div className={(styles.printModeContainer, styles.noPrint)}>
          <div className={styles.printModeTitle}>Tulostustila</div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              value={`${this.props.id}`}
              checked={this.props.showPrintLayout}
              onChange={this.props.togglePrintLayout}
            />
            <div
              style={{ backgroundColor: sliderBackgroundColor }}
              className={classNames(styles.slider)}
            />
          </label>
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
        {sortedLines.map((line, index) => {
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
              <div id={"map-container_" + line.lineId} className="map-container">
                <RouteFilter
                  routeIndex={index}
                  lineId={line.lineId}
                  transportType={line.transportType}
                  lineName={line.lineNameFi}
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
