import React from "react";
import chroma from "chroma-js";
import Sidebar from "./sidebar";
import MapLeaflet from "./mapLeaflet";
import styles from "./map.module.css";

const COLORS = [
  "66B2FF",
  "FF3333",
  "66FFB2",
  "FF007F",
  "CCCC00",
  "176992",
  "6600CC",
  "009900",
  "FFE707",
];

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedRoutes: [],
      routeColorSchema: {},
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

  addToColorMap(route) {
    const routeColorSchema = this.state.routeColorSchema;

    if (routeColorSchema[route]) return;

    const scale = chroma.scale(COLORS).domain([0, COLORS.length]);
    const colorIndex = Object.keys(routeColorSchema).length % (COLORS.length + 1);
    const routeColor = scale(colorIndex).hex();

    routeColorSchema[route] = routeColor;
    this.setState({ routeColorSchema });
  }

  addSelection(route) {
    this.addToColorMap(route);

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

  coloredRoutes(routes) {
    const colorSchema = this.state.routeColorSchema;
    routes.forEach((route, index) => {
      const routeId = `${route.routeId}_${route.direction}_${route.dateBegin}`;
      route.color = colorSchema[routeId];
    });
    return routes;
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

    const coloredRoutes = this.coloredRoutes(routes);
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
          onAddLines={this.props.onAddLines}
        />
        <MapLeaflet
          center={this.state.center}
          routes={coloredRoutes}
          selectedRoutes={this.state.selectedRoutes}
          isFullScreen={this.state.isFullScreen}
          toggleFullscreen={this.mapLeafletToggleFullscreen}
        />
      </div>
    );
  }
}

export default Map;
