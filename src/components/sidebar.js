import React from "react";
import { FiXCircle } from "react-icons/fi";
import { inject, observer } from "mobx-react";
import classnames from "classnames";
import RouteFilter from "./routeFilter";
import LineList from "./lineList";
import LineIcon from "./lineIcon";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Header from "./header";
import Notes from "./notes";
import styles from "./sidebar.module.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LineAlertList from "./lineAlertList";

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddLines: false,
    };
  }

  async componentDidMount() {
    this.props.getAlerts();
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

  onAddLinesToggle = () => {
    const showAddLines = this.state.showAddLines;
    this.setState({ showAddLines: !showAddLines });
    if (!showAddLines && this.props.isMobile) {
      // Show drawer when "Lisää linjoja" is clicked
      this.props.setDrawerHeight(380);
    }
  };

  render() {
    const selectedLines = this.props.lineStore.getSelectedLines;
    const sliderBackgroundColor = this.props.showPrintLayout ? "#006db6" : "#d3d3d3";
    const headerIcon = (
      <div>
        {this.state.showAddLines ? (
          <FiChevronUp className={styles.dropdownButtonExpanded} />
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
    const isMobile = this.props.isMobile;
    console.log(sortedLines);
    const mappedAlerts = this.props.alerts.map(({ lineId, alerts }) => {
      return {
        line: sortedLines.find((line) => line.lineId === lineId),
        alerts: alerts,
      };
    });
    return (
      <div
        className={classnames(styles.root, {
          [styles.hidden]: this.props.isFullScreen,
        })}>
        {!isMobile && <Header />}
        <div
          className={classnames(
            styles.addLineTitleContainer,
            this.state.showAddLines ? styles.addLineTitleContainerExpanded : null
          )}
          onClick={() => this.onAddLinesToggle()}>
          <div
            className={classnames(
              styles.addLineTitle,
              this.state.showAddLines ? styles.addLineTitleExpanded : null
            )}>
            Lisää linjoja
          </div>
          {headerIcon}
        </div>
        <div
          className={classnames(
            styles.sideBarLineList,
            this.state.showAddLines ? "" : styles.hidden,
            isMobile ? styles.sideBarLineListMobile : null
          )}>
          {this.state.showAddLines && (
            <LineList hideTitle isMobile={isMobile} ignoredLines={this.props.lines} />
          )}
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
        <div>
          <Tabs
            selectedTabClassName={styles.selectedTab}
            disabledTabClassName={styles.disabledTab}
            className={styles.tabGroup}>
            <div className={styles.tabDiv}>
              <TabList>
                <Tab className={classnames(styles.inlineTab, styles.linesTabBtn)}>
                  Linjat
                </Tab>
                <Tab
                  className={classnames(styles.inlineTab, styles.alertsTabBtn, {
                    [styles.noAlertsText]: this.props.alerts.length < 1,
                  })}>
                  Poikkeukset
                </Tab>
              </TabList>
            </div>

            <TabPanel>
              {sortedLines.map((line, index) => {
                return (
                  <div key={index} className={styles.elementContainer}>
                    <div className={styles.headerContainer}>
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
                      <div className={styles.removeButtonContainer}>
                        <FiXCircle
                          onClick={() =>
                            this.props.lines.length > 1
                              ? this.props.removeSelectedLine(line)
                              : ""
                          }
                          className={classnames(
                            this.props.lines.length > 1
                              ? isMobile
                                ? styles.iconMobile
                                : styles.icon
                              : styles.iconDisabled
                          )}
                        />
                      </div>
                    </div>
                    <Notes notes={line.notes} />
                  </div>
                );
              })}
            </TabPanel>
            <TabPanel>
              {this.props.alerts.length >= 1 &&
                !this.props.isLoading &&
                mappedAlerts.map(({ line, alerts }, index) => {
                  return <LineAlertList key={index} alerts={alerts} line={line} />;
                })}
              {this.props.isLoading && (
                <p className={styles.loadingText}>LADATAAN TIEDOTTEITA...</p>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default inject("lineStore")(observer(Sidebar));
