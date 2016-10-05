import React from "react";
import MapLeaflet from "./mapLeaflet";
import RouteFilter from "./routeFilter";
import contentStyles from "./content.css";
import mapStyles from "./map.css";
import busIcon from "../icons/icon-bus-station.svg";
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
            routeGeometries: "",
            routeStops: "",
            selectedRoutes: [],
            lat: 0,
            lng: 0,
        };
        this.filterUpdate = this.filterUpdate.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
        this.addSelection = this.addSelection.bind(this);
    }

    componentDidMount() {
        const p1 = getLine(this.props.params.id);
        const p2 = getRouteGeometries(this.props.params.id);
        const p3 = getRoutes(this.props.params.id);

        Promise.all([p1, p2, p3]).then(([fetchedLine, fetchedGeometries, fetchedRoutes]) => {
            const firstStop = Object.values(fetchedRoutes)[0][0].stops[0];
            const selected = routeArray(fetchedRoutes).map(route =>
                route.routeId + "_" + route.direction
            );
            this.setState({
                lineNumber: fetchedLine.lineNumber,
                lineNameFi: fetchedLine.name_fi,
                routeGeometries: fetchedGeometries,
                routeStops: routeArray(fetchedRoutes),
                selectedRoutes: selected,
                lat: Number(firstStop.lat),
                lng: Number(firstStop.lon),
            });
        });
    }

    filterUpdate(e) {
        if (this.state.selectedRoutes.includes(e.target.value)) {
            this.removeSelection(e.target.value);
        } else this.addSelection(e.target.value);
    }

    removeSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.filter(selected => (route !== selected)),
        });
    }

    addSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.concat(route),
        });
    }

    render() {
        return (
            <div className={contentStyles.root}>
                <div className={contentStyles.contentBox}>
                    <div className={mapStyles.titleWrapper}>
                        <img src={busIcon} alt="Bus" height="27"/>
                        <h1 className={mapStyles.titleRouteNumber}>
                            {this.state.lineNumber}
                        </h1>
                        <h2>
                            {this.state.lineNameFi}
                        </h2>
                    </div>
                    <div className={mapStyles.contentWrapper}>
                        <div className={mapStyles.mapContainer}>
                            <MapLeaflet
                              lat={this.state.lat}
                              lng={this.state.lng}
                              routeGeometries={this.state.routeGeometries}
                              routeStops={this.state.routeStops}
                              selectedRoutes={this.state.selectedRoutes}
                            />
                        </div>
                        <div className={mapStyles.filterContainer}>
                            <RouteFilter
                              routeStops={this.state.routeStops}
                              selectedRoutes={this.state.selectedRoutes}
                              handleChange={this.filterUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default Map;
