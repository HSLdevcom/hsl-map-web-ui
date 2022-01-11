import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import MapLeaflet from "./mapLeaflet";
import classnames from "classnames";
import styles from "./map.module.css";
import { isMobile } from "../utils/browser";

const COLORS = [
  "66B2FF",
  "ff6633",
  "10864B",
  "CDB100",
  "1D80B2",
  "6600CC",
  "F7922D",
  "DC00DC",
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
      bottomsheetState: { context: { mapBottomPadding: 0, buttonBottomPadding: 0 } },
      isMobile: false,
    };
    this.mapLeafletToggleFullscreen = this.mapLeafletToggleFullscreen.bind(this);
    this.routeFilterToggleFilter = this.routeFilterToggleFilter.bind(this);
    this.routeFilterItemToggleChecked = this.routeFilterItemToggleChecked.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
    this.setDrawerHeight = this.setDrawerHeight.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    this.setState({ isMobile: isMobile });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  resizeHandler = () => {
    const mobile = window.innerWidth < 700;
    this.setState({ isMobile: mobile });
  };

  setMapCenter(center) {
    this.setState({ center });
  }

  addToColorMap(route) {
    const routeColorSchema = this.state.routeColorSchema;
    if (routeColorSchema[route]) return;

    const routeColorSchemaValues = Object.values(routeColorSchema);
    const routeColor = `#${COLORS[routeColorSchemaValues.length % COLORS.length]}`;
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
    const nextIsFullScreen = !this.state.isFullScreen;
    this.setState({
      isFullScreen: nextIsFullScreen,
    });
    return nextIsFullScreen;
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
      route.color = colorSchema[route.id];
    });
    return routes;
  }

  setDrawerHeight = (height) => {
    if (this.refs.drawer.scrollTop < height) {
      this.refs.drawer.scrollTop = height;
    }
  };

  render() {
    const lines = this.props.mapProps.map((props) => {
      const routes = props.lineRoutes.map((r) => ({
        ...r,
        name: props.nameFi,
        id: `${props.nameFi}_${r.routeId}_${r.direction}_${r.dateBegin}_${r.dateEnd}`,
      }));
      return {
        lineId: props.lineId,
        lineKey: props.lineKey,
        transportType: props.transportType,
        lineNumber: props.lineNumber,
        lineNameFi: props.nameFi,
        routes: routes,
        notes: props.notes,
      };
    });
    const routes = lines.reduce((acc, curr) => acc.concat(curr.routes), []);
    const coloredRoutes = this.coloredRoutes(routes);

    const mapComponent = (
      <MapLeaflet
        center={this.state.center}
        setMapCenter={this.setMapCenter}
        routes={coloredRoutes}
        selectedRoutes={this.state.selectedRoutes}
        isFullScreen={this.state.isFullScreen}
        toggleFullscreen={this.mapLeafletToggleFullscreen}
        restrooms={this.props.mapProps.restrooms}
      />
    );

    return (
      <div className={styles.root}>
        {this.state.isMobile && <Header isMobile={this.state.isMobile} />}
        {this.state.isMobile && (
          <div className={styles.drawerContainer} ref="drawer">
            <div className={styles.drawerPadding} />
            <div className={styles.drawerContent}>
              <div className={styles.dragLine} />
              <div className={styles.contentContainer}>
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
                  isMobile={this.state.isMobile}
                  setDrawerHeight={this.setDrawerHeight}
                />
              </div>
            </div>
          </div>
        )}
        {!this.state.isMobile && (
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
        )}
        {this.state.isMobile ? (
          <div className={styles.mapContainer}>{mapComponent}</div>
        ) : (
          mapComponent
        )}
      </div>
    );
  }
}

export default Map;
