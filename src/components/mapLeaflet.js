import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import { routeIcon, stopIcon } from "utils/mapIcon";
import startIcon1 from "icons/icon-suunta1.svg";
import startIcon2 from "icons/icon-suunta2.svg";
import timeIcon1 from "icons/icon-time1.svg";
import timeIcon2 from "icons/icon-time2.svg";

import styles from "./mapLeaflet.css";

const addMarkersToLayer = (stops, direction, map) => {
    /** Sets the correct icon based on direction (1 or 2),
    and what type of stop (regular, first stop or timing stop) **/
    let directionStyle = styles.direction1;
    let startIcon = startIcon1;
    let timeIcon = timeIcon1;
    if (direction === "2") {
        directionStyle = styles.direction2;
        startIcon = startIcon2;
        timeIcon = timeIcon2;
    }
    stops.forEach((stop, index) => {
        let setIcon;
        if (index === 0) setIcon = routeIcon(startIcon);
        else if (stop.isTiming) setIcon = routeIcon(timeIcon);
        else setIcon = stopIcon(styles.stopIcon, directionStyle);
        L.marker(
            [stop.lon, stop.lat],
            { icon: setIcon }
        ).addTo(map);
    });
};

const addStopLayer = (routes, map) => {
    routes.forEach((route) => {
        addMarkersToLayer(route.stops, route.direction, map);
    });
};

const addGeometryLayer = (geometries, map) => {
    geometries.forEach((route) => {
        L.geoJson(route, {
            style: (feature) => {
                const shapeId = feature.properties.shape_id;
                const direction = shapeId.substr(shapeId.indexOf("_") + 1);
                switch (direction) {
                case "1": return { color: "blue" };
                case "2": return { color: "black" };
                default: return { color: "blue" };
                }
            },
        }).addTo(map);
    });
};


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
            baseLayer: true,
        }).addTo(this.map);
    }

    componentDidUpdate(prevProps) {
        // All layers exept the base layer are removed when the component is updated
        this.map.eachLayer((layer) => {
            if (!layer.options.baseLayer) this.map.removeLayer(layer);
        });

        // Leaflet map is updated once geometry and stop data has been fetched
        // The view (bounding box) is set only the first time the route stops are recieved
        if (!prevProps.routeStops) {
            const arrBounds = this.props.routeStops[0].stops.map(stop => [stop.lon, stop.lat]);
            this.map.fitBounds(arrBounds);
        }

        if (this.props.routeStops) {
            const selectedStops = this.props.routeStops.filter(route =>
                this.props.selectedRoutes.includes(route.routeId + "_" + route.direction + "_" + route.dateBegin)
            );
            addStopLayer(selectedStops, this.map);

            const selectedGeometries = this.props.routeGeometries.filter(route =>
                this.props.selectedRoutes.includes(route.properties.shape_id + "_" + route.properties.dateBegin)
            );
            addGeometryLayer(selectedGeometries, this.map);
        }
    }

    render() { // eslint-disable-line class-methods-use-this
        // Container div for leaflet map is created
        return (
            <div className={styles.root}>
                <div id="mapid" className={styles.map}/>
            </div>
        );
    }
}

export default MapLeaflet;
