import React from "react";
import Sidebar from "./sidebar";
import MapLeaflet from "./mapLeaflet";
import styles from "./map.css";
import { getLine, getRoutes, getRouteGeometries } from "../utils/api";

const parseRouteNumber = routeId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    routeId.substring(1).replace(/^0+/, "");

const routeArray = (routes) => {
    const routeArr = [];
    Object.entries(routes).forEach((route) => {
        const routeId = route[0];
        route[1].forEach((direction) => {
            direction.routeId = routeId;
            direction.routeNumber = parseRouteNumber(routeId);
            routeArr.push(direction);
        });
    });
    return routeArr;
};


class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            lineNumber: "",
            lineNameFi: "",
            transportType: "",
            routeGeometries: "",
            routeStops: "",
            selectedRoutes: [],
            showFilterFullScreen: false,
            isFullScreen: false,
            scrollEnabled: true,
        };
        this.addSelection = this.addSelection.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
        this.mapLeafletToggleFullscreen = this.mapLeafletToggleFullscreen.bind(this);
        this.routeFilterToggleFilter = this.routeFilterToggleFilter.bind(this);
        this.routeFilterScrollWheelUpdate = this.routeFilterScrollWheelUpdate.bind(this);
        this.routeFilterItemToggleChecked = this.routeFilterItemToggleChecked.bind(this);
    }

    componentDidMount() {
        const p1 = getLine(this.props.params.id);
        const p2 = getRouteGeometries(this.props.params.id);
        const p3 = getRoutes(this.props.params.id);

        Promise.all([p1, p2, p3]).then(([fetchedLine, fetchedGeometries, fetchedRoutes]) => {
            const selected = routeArray(fetchedRoutes).map(route =>
                route.routeId + "_" + route.direction + "_" + route.dateBegin
            );
            this.setState({
                lineNumber: fetchedLine.lineNumber,
                lineNameFi: fetchedLine.name_fi,
                transportType: fetchedLine.transportType,
                routeGeometries: fetchedGeometries,
                routeStops: routeArray(fetchedRoutes),
                selectedRoutes: selected,
            });
        });
    }

    addSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.concat(route),
        });
    }

    removeSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.filter(selected => (route !== selected)),
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

    routeFilterScrollWheelUpdate(isEnabled) {
        this.setState({
            scrollEnabled: isEnabled,
        });
    }

    routeFilterItemToggleChecked(e) {
        if (this.state.selectedRoutes.includes(e.target.value)) {
            this.removeSelection(e.target.value);
        } else this.addSelection(e.target.value);
    }

    render() {
        return (
            <div className={styles.root}>
                <Sidebar
                  transportType={this.state.transportType}
                  lineNumber={this.state.lineNumber}
                  lineNameFi={this.state.lineNameFi}
                  routeStops={this.state.routeStops}
                  selectedRoutes={this.state.selectedRoutes}
                  showFilter={this.state.showFilterFullScreen}
                  isFullScreen={this.state.isFullScreen}
                  toggleChecked={this.routeFilterItemToggleChecked}
                  toggleFilter={this.routeFilterToggleFilter}
                  scrollWheelUpdate={this.routeFilterScrollWheelUpdate}
                />
                <MapLeaflet
                  routeGeometries={this.state.routeGeometries}
                  routeStops={this.state.routeStops}
                  selectedRoutes={this.state.selectedRoutes}
                  isFullScreen={this.state.isFullScreen}
                  scrollEnabled={this.state.scrollEnabled}
                  toggleFullscreen={this.mapLeafletToggleFullscreen}
                />
            </div>);
    }
}

export default Map;
