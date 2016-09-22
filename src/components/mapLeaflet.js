import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import styles from "./mapLeaflet.css";
import { routeIcon, stopIcon } from "../utils/mapIcon";

class MapLeaflet extends React.Component {

    componentDidMount() {
        // Leaflet map is created and initialized
        this.map = L.map("mapid", {
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: "topleft",
            },
        });
        L.tileLayer("http://api.digitransit.fi/map/v1/hsl-map/{z}/{x}/{y}{retina}.png", {
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            retina: L.retina ? "" : "@2x",
        }).addTo(this.map);
    }

    componentDidUpdate() {
        // Leaflet map is updated once geometry and stop data has been fetched
        this.map.setView([this.props.lat, this.props.lng], 14);

        if (this.props.geometry) {
            const routesArray = Object.values(JSON.parse(this.props.geometry));

            // TODO: update shape colors to HSL colors
            routesArray.map(route => L.geoJson(route, {
                style: (feature) => {
                    const shapeId = feature.properties.shape_id;
                    const direction = shapeId.substr(shapeId.indexOf("_") + 1);
                    switch (direction) {
                    case "1": return { color: "blue" };
                    case "2": return { color: "black" };
                    default: return { color: "blue" };
                    }
                },
            }).addTo(this.map));
        }
        if (this.props.stops) {
            const stops = JSON.parse(this.props.stops);
            L.geoJson(stops, {
                pointToLayer: (feature, latlng) => {
                    /** Gets the correct icon based on direction (1 or 2),
                    and what type of stop (regular, first stop or timing stop) **/
                    const directionStyle = feature.properties.route.endsWith("2") ? styles.direction2 : styles.direction1;
                    const direction = feature.properties.route.endsWith("2") ? "2" : "1";
                    if (feature.properties.first === "true") {
                        return L.marker(latlng, { icon: routeIcon("icons/icon-suunta", direction) });
                    } else if (feature.properties.timepoint === "true") {
                        return L.marker(latlng, { icon: routeIcon("icons/icon-time", direction) });
                    }
                    return L.marker(latlng, { icon: stopIcon(styles.stopIcon, directionStyle) });
                },
            }).addTo(this.map);
        }
    }

    render() { // eslint-disable-line class-methods-use-this
        // Container div for leaflet map is created
        return (
            <div className={styles.root}>
                <h1>Reittikartta</h1>
                <div id="mapid" className={styles.map}/>
            </div>
        );
    }
}

MapLeaflet.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
    geometry: React.PropTypes.string.isRequired,
    stops: React.PropTypes.string.isRequired,
};

export default MapLeaflet;
