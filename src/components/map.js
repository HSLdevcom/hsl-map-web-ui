import React from "react";
import MapLeaflet from "./mapLeaflet";
import contentStyles from "./content.css";
import mapStyles from "./map.css";
import busIcon from "../icons/icon-bus-station.svg";
import { getLine } from "../utils/api";


class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            lineNumber: "",
            lineNameFi: "",
            geometry: "",
            stops: "",
            lat: 0,
            lng: 0,
        };
        this.getRoute = this.getRoute.bind(this);
        this.getStops = this.getStops.bind(this);
    }

    componentDidMount() {
        getLine(this.props.params.id).then(fetchedLine => {
            this.setState({
                lineNumber: fetchedLine.lineNumber,
                lineNameFi: fetchedLine.name_fi,
            });
        });
        this.getStops(this.props.params.id);
        this.getRoute(this.props.params.id);
    }

    getRoute(id) {
        fetch(`http://localhost:8000/routeGeometries/${id}`, {
            method: "GET",
            mode: "cors",
        })
        .then(response => response.json())
        .then((json) => {
            this.setState({
                geometry: JSON.stringify(json),
            });
        });
    }
    getStops(id) {
        fetch(`http://localhost:8000/routeStops/${id}`, {
            method: "GET",
            mode: "cors",
        })
        .then(response => response.json())
        .then((json) => {
            // Center coordinates for map (lat,lng) currently set to first route's first stop
            this.setState({
                stops: JSON.stringify(json),
                lat: json[0].geometry.coordinates[1],
                lng: json[0].geometry.coordinates[0],

            });
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
                        <h3>
                            {this.state.lineNameFi}
                        </h3>
                    </div>
                    <MapLeaflet
                      lat={this.state.lat}
                      lng={this.state.lng}
                      geometry={this.state.geometry}
                      stops={this.state.stops}
                    />
                </div>
            </div>);
    }
}

export default Map;
