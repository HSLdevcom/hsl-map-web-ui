import React from "react";
import MapLeaflet from "./mapLeaflet";
import contentStyles from "./content.css";
import mapStyles from "./map.css";
import busIcon from "../icons/icon-bus-station.svg";
import { getLine, getStopGeometries, getRouteGeometries } from "../utils/api";


class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            lineNumber: "",
            lineNameFi: "",
            stopGeometries: "",
            routeGeometries: "",
            lat: 0,
            lng: 0,
        };
    }

    componentDidMount() {
        getLine(this.props.params.id).then(fetchedLine =>
            this.setState({
                lineNumber: fetchedLine.lineNumber,
                lineNameFi: fetchedLine.name_fi,
            })
        );
        getStopGeometries(this.props.params.id).then(fetchedStops =>
            this.setState({
                stopGeometries: JSON.stringify(fetchedStops),
                lat: fetchedStops[0].geometry.coordinates[1],
                lng: fetchedStops[0].geometry.coordinates[0],
            })
        );
        getRouteGeometries(this.props.params.id).then(fetchedRoutes =>
            this.setState({
                routeGeometries: JSON.stringify(fetchedRoutes),
            })
        );
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
                        <h3>
                            {this.state.lineNameFi}
                        </h3>
                    </div>
                    <MapLeaflet
                      lat={this.state.lat}
                      lng={this.state.lng}
                      geometry={this.state.routeGeometries}
                      stops={this.state.stopGeometries}
                    />
                </div>
            </div>);
    }
}

export default Map;
