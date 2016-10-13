import React from "react";
import L from "leaflet";
import chroma from "chroma-js";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";
import { routeIcon, stopIcon } from "utils/mapIcon";
import startIcon1 from "icons/icon-suunta1.svg";
import startIcon2 from "icons/icon-suunta2.svg";
import timeIcon1 from "icons/icon-time1.svg";
import timeIcon2 from "icons/icon-time2.svg";
import RouteFilter from "./routeFilter";
import ExpandButton from "./expandButton";
import styles from "./mapLeaflet.css";

const blueColorScale = chroma.scale(["00B9E4", "004E80", "001F33"]).domain([0, 5]);
const redColorScale = chroma.scale(["FF944d", "B30059", "990000"]).domain([0, 5]);

const modifiedColor = (colorScale, key) => colorScale(key);

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
                switch (feature.properties.direction) {
                case "1": return {
                    color: modifiedColor(blueColorScale, route.properties.colorKey),
                    opacity: 1,
                };
                case "2": return {
                    color: modifiedColor(redColorScale, route.properties.colorKey),
                    opacity: 1,
                };
                default: return {
                    color: "001F33",
                    opacity: 1,
                };
                }
            },
        }).addTo(map);
    });
};

const addRouteFilterLayer = (map) => {
    const RouteFilterControl = L.Control.extend({
        options: {
            position: "bottomright",
        },
        onAdd: () => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
            container.appendChild(document.getElementById("route-filter"));
            return container;
        },
    });
    map.addControl(new RouteFilterControl());
};

class MapLeaflet extends React.Component {
    constructor() {
        super();
        this.state = {
            showFilter: true,
            fullScreen: false,
        };
        this.initializeMap = this.initializeMap.bind(this);
        this.addLayersToMap = this.addLayersToMap.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
    }


    componentDidMount() {
        this.initializeMap(this.map);
    }

    componentDidUpdate(prevProps) {
        // All layers except the base layer are removed when the component is updated
        this.map.eachLayer((layer) => {
            if (!layer.options.baseLayer) this.map.removeLayer(layer);
        });

        // Leaflet map is updated once geometry and stop data has been fetched
        // The view (bounding box) is set only the first time the route stops are recieved
        if (!prevProps.routeStops) {
            const arrBounds = this.props.routeStops[0].stops.map(stop => [stop.lon, stop.lat]);
            this.map.fitBounds(arrBounds);
        }

        this.addLayersToMap(this.map);
    }

    initializeMap() {
        this.map = L.map("map-leaflet", {
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

        this.map.on("enterFullscreen", () => {
            this.setState({
                fullScreen: true,
            });
            addRouteFilterLayer(this.map);
        });

        this.map.on("exitFullscreen", () => {
            this.setState({
                showFilter: true,
                fullScreen: false,
            });
            document.getElementById("map-container").appendChild(document.getElementById("route-filter"));
        });
    }

    addLayersToMap() {
        if (this.props.routeStops) {
            const selectedStops = this.props.routeStops.filter(route =>
                this.props.selectedRoutes.includes(`${route.routeId}_${route.direction}_${route.dateBegin}`)
            );

            addStopLayer(selectedStops, this.map);

            let index1 = 0;
            let index2 = 0;
            let colorKey;
            const selectedGeometries = this.props.routeGeometries.map((route) => {
                if (route.properties.direction === "1") {
                    colorKey = index1;
                    index1 += 1;
                } else if (route.properties.direction === "2") {
                    colorKey = index2;
                    index2 += 1;
                }
                route.properties = { ...route.properties, colorKey };

                return route;
            })
            .filter(route =>
                this.props.selectedRoutes.includes(`${route.properties.lineId}_${route.properties.direction}_${route.properties.beginDate}`)
            );

            addGeometryLayer(selectedGeometries, this.map);
        }
    }

    toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter,
        });
    }

    render() {
        // Container div (id="map-container") for leaflet map is created
        return (
            <div id="map-container" className={styles.root}>
                <div className={styles.mapContainer}>
                    <div id="map-leaflet" className={styles.map}/>
                </div>
                <div id="route-filter" className={styles.filterContainer}>
                    {this.state.fullScreen ?
                        <ExpandButton
                          onClick={this.toggleFilter}
                          labelText="Valitse reitit"
                          isExpanded={this.state.showFilter}
                        />
                        : <h3>Valitse reitit</h3>
                    }
                    <div className={this.state.showFilter ? "" : styles.hidden}>
                        <RouteFilter
                          routeStops={this.props.routeStops}
                          selectedRoutes={this.props.selectedRoutes}
                          handleChange={this.props.handleChange}
                        />
                    </div>
                </div>
            </div>

        );
    }
}

export default MapLeaflet;
