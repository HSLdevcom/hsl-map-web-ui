import React from "react";
import MapLeaflet from "./mapLeaflet";
import styles from "./content.css";
import busIcon from "../icons/icon-bus-station.svg";

class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            geometry: "",
            stops: "",
            id: "",
            lat: 0,
            lng: 0,
        };
        this.getRoute = this.getRoute.bind(this);
        this.getStops = this.getStops.bind(this);
    }

    componentDidMount() {
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
            <div className={styles.root}>
                <div className={styles.elementContainer}>
                    <div className={styles.infoWrapper}>
                        <img src={busIcon} alt="Bus" height="27"/>
                        <h1 className={styles.shortName}>
                            {this.props.location.query.routeNumber}
                        </h1>
                        <h3 className={styles.longName}>
                            {this.props.location.query.routeName}
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
