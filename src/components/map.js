import React from "react";
import Sidebar from "./sidebar";
import MapLeaflet from "./mapLeaflet";
import styles from "./map.module.css";

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedRoutes: [],
      showFilterFullScreen: false,
      isFullScreen: false,
      center: null,
    };
    this.mapLeafletToggleFullscreen = this.mapLeafletToggleFullscreen.bind(this);
    this.routeFilterToggleFilter = this.routeFilterToggleFilter.bind(this);
    this.routeFilterItemToggleChecked = this.routeFilterItemToggleChecked.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
  }

  setMapCenter(center) {
    this.setState({ center });
  }

  addSelection(route) {
    this.setState({
      selectedRoutes: this.state.selectedRoutes.concat(route),
    });
  }

  removeSelection(route) {
    this.setState({
      selectedRoutes: this.state.selectedRoutes.filter((selected) => route !== selected),
    });
  }

  mapLeafletToggleFullscreen() {
    this.setState({
      isFullScreen: !this.state.isFullScreen,
    });
  }

  routeFilterToggleFilter() {
    this.setState({
      showFilterFullScreen: !this.state.showFilterFullScreen,
    });
  }

  routeFilterItemToggleChecked(e) {
    if (this.state.selectedRoutes.includes(e.target.value)) {
      this.removeSelection(e.target.value);
    } else this.addSelection(e.target.value);
  }

  render() {
    let routes = [];
    this.props.mapProps.forEach((props) => {
      routes = routes.concat(props.lineRoutes);
    });
    const lines = this.props.mapProps.map((props) => {
      return {
        lineId: props.lineId,
        transportType: props.transportType,
        lineNumber: props.lineNumber,
        lineNameFi: props.nameFi,
        routes: props.lineRoutes,
        notes: props.notes,
      };
    });

    return (
      <div className={styles.root}>
        <Sidebar
          lines={lines}
          selectedRoutes={this.state.selectedRoutes}
          showFilter={this.state.showFilterFullScreen}
          isFullScreen={this.state.isFullScreen}
          toggleChecked={this.routeFilterItemToggleChecked}
          toggleFilter={this.routeFilterToggleFilter}
          notes={lines.notes}
          setMapCenter={this.setMapCenter}
          removeSelectedLine={this.props.mapProps.removeSelectedLine}
        />
        <MapLeaflet
          center={this.state.center}
          routes={routes}
          selectedRoutes={this.state.selectedRoutes}
          isFullScreen={this.state.isFullScreen}
          toggleFullscreen={this.mapLeafletToggleFullscreen}
        />
      </div>
    );
  }
}

export default Map;
