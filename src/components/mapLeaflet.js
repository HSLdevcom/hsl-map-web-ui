import React from "react";
import classNames from "classnames";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routeIcon, stopIcon } from "../utils/mapIcon";
import startIcon1 from "../icons/icon-suunta1.svg";
import startIcon2 from "../icons/icon-suunta2.svg";
import timeIcon1 from "../icons/icon-time1.svg";
import timeIcon2 from "../icons/icon-time2.svg";
import locationIconOnline from "../icons/icon-location-online.svg";
import locationIconOffline from "../icons/icon-location-offline.svg";
import fullScreenEnterIcon from "../icons/icon-fullscreen-enter.svg";
import fullScreenExitIcon from "../icons/icon-fullscreen-exit.svg";
import styles from "./mapLeaflet.module.css";

const addMarkersToLayer = (stops, direction, map) => {
  /** Sets the correct icon based on direction (1 or 2),
    and what type of stop (regular, first stop or timing stop) **/
  let startIcon = startIcon1;
  let timeIcon = timeIcon1;
  if (direction === "2") {
    startIcon = startIcon2;
    timeIcon = timeIcon2;
  }

  stops.forEach((stop, index) => {
    let icon;
    if (index === 0) {
      icon = routeIcon(startIcon);
    } else if (stop.timingStopType > 0) {
      icon = routeIcon(timeIcon);
    } else {
      icon = stopIcon(stop.isCenteredStop && styles.centeredStop, stop.color);
    }

    const marker = L.marker([stop.lat, stop.lon], { icon });
    marker.bindTooltip(`${stop.shortId} ${stop.nameFi}`, { direction: "top" });
    marker.addTo(map);
  });
};

const addStopLayer = (routes, map, centeredStop) => {
  routes.forEach((route) => {
    addMarkersToLayer(
      route.routeSegments.nodes
        .map((node) => ({
          ...node.stop,
          timingStopType: node.timingStopType,
          stopIndex: node.stopIndex,
          isCenteredStop: centeredStop && centeredStop.stopId === node.stop.stopId,
          color: route.color,
        }))
        .sort((a, b) => a.stopIndex - b.stopIndex),
      route.direction,
      map
    );
  });
};

const addGeometryLayer = (geometries, map) => {
  geometries.forEach((route) => {
    L.geoJson(route, {
      style: (feature) => {
        return {
          color: feature.properties.color,
          opacity: 1,
        };
      },
    }).addTo(map);
  });
};

const addControlButton = (map, toggleFullscreen) => {
  const FullScreenControl = L.Control.extend({
    options: {
      position: "topleft",
    },
    onAdd: () => {
      const icon = L.DomUtil.create("img");
      const container = L.DomUtil.create("button", "leaflet-bar leaflet-control");
      icon.src = fullScreenEnterIcon;
      icon.height = "11";
      icon.width = "11";
      container.className = styles.controlButton;
      container.appendChild(icon);
      container.onclick = () => {
        icon.src = toggleFullscreen() ? fullScreenExitIcon : fullScreenEnterIcon;
      };
      return container;
    },
  });
  map.addControl(new FullScreenControl());
};

const addLocationButton = (map, toggleLocation) => {
  const LocationControl = L.Control.extend({
    options: {
      position: "topleft",
    },
    onAdd: () => {
      const icon = L.DomUtil.create("img");
      const container = L.DomUtil.create("button", "leaflet-bar leaflet-control");
      icon.src = locationIconOffline;
      icon.height = "11";
      icon.width = "11";
      container.className = styles.controlButton;
      container.appendChild(icon);
      container.onclick = () => {
        icon.src = toggleLocation() ? locationIconOnline : locationIconOffline;
      };
      return container;
    },
  });
  map.addControl(new LocationControl());
}

const addRouteFilterLayer = (map) => {
  const RouteFilterControl = L.Control.extend({
    options: {
      position: "bottomright",
    },
    onAdd: () => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-bottomright"
      );
      L.DomEvent.disableScrollPropagation(container);
      return container;
    },
  });
  map.addControl(new RouteFilterControl());
};

const updateFilterLayer = (isFullScreen) => {
  if (isFullScreen)
    document
      .getElementsByClassName("leaflet-control-bottomright")[0]
      .appendChild(document.getElementById("route-filter"));
  else
    document
      .getElementById("map-container")
      .appendChild(document.getElementById("route-filter"));
};

class MapLeaflet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationOn: false,
      locationMarker: null
    }

    this.map = null;
    this.initializeMap = this.initializeMap.bind(this);
    this.addLayersToMap = this.addLayersToMap.bind(this);
    this.toggleLocation = this.toggleLocation.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate(prevProps) {
    // All layers except the base layer are removed when the component is updated
    this.map.eachLayer((layer) => {
      if (!layer.options.baseLayer) this.map.removeLayer(layer);
    });

    // Leaflet map is updated once geometry and stop data has been fetched
    // The view (bounding box) is set only the first time the route stops are recieved
    if (
      prevProps.selectedRoutes.length < 1 &&
      this.props.routes &&
      this.props.routes[0]
    ) {
      const arrBounds = this.props.routes[0].routeSegments.nodes.map(({ stop }) => [
        stop.lat,
        stop.lon,
      ]);
      this.map.fitBounds(arrBounds);
    }

    if (prevProps.center !== this.props.center) {
      this.map.panTo(this.props.center);
    }

    this.addLayersToMap(this.map);

    // Add location marker to map if user location is on
    if (this.state.locationOn === true && this.state.locationMarker) {
      this.state.locationMarker.addTo(this.map)
    }

    updateFilterLayer(this.props.isFullScreen);
    this.map.invalidateSize();
  }

  toggleLocation() {
    const nextLocationOn = !this.state.locationOn;
    let locationMarker;

    if (nextLocationOn) {
      locationMarker = L.circleMarker([0,0], { radius: 8, fillOpacity: 1, interactive: false, color: "#ffffff", fillColor: "#3388ff" });
      this.map.on("locationfound", (e) => { locationMarker.setLatLng(e.latlng); });
      this.map.on("locationerror", (e) => { alert("Sijantia ei voitu määrittää. Tarkista selaimen ja laitteen asetukset.") });
      this.map.locate({ watch: true });
    } else {
      locationMarker = null;
      this.map.off("locationfound");
      this.map.off("locationerror");
      this.map.stopLocate();
    }

    this.setState({
      locationOn: nextLocationOn,
      locationMarker: locationMarker
    })

    return nextLocationOn;
  }

  initializeMap() {
    this.map = L.map("map-leaflet").setView([60.170988, 24.940842], 13);

    L.tileLayer(
      "https://digitransit-prod-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png",
      {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        retina: L.retina ? "@2x" : "",
        baseLayer: true,
      }
    ).addTo(this.map);

    addControlButton(this.map, this.props.toggleFullscreen);
    addLocationButton(this.map, this.toggleLocation );
    addRouteFilterLayer(this.map);
  }

  addLayersToMap() {
    if (this.props.routes) {
      const selectedStops = this.props.routes.filter((route) =>
        this.props.selectedRoutes.includes(
          `${route.name}_${route.routeId}_${route.direction}_${route.dateBegin}_${route.dateEnd}`
        )
      );

      addStopLayer(selectedStops, this.map, this.props.center);

      const selectedGeometries = this.props.routes
        .map((route) => {
          return {
            type: "Feature",
            properties: { ...route },
            geometry: route.geometries.nodes[0].geometry,
          };
        })
        .filter((route) =>
          this.props.selectedRoutes.includes(
            `${route.properties.name}_${route.properties.routeId}_${route.properties.direction}_${route.properties.dateBegin}_${route.properties.dateEnd}`
          )
        );

      addGeometryLayer(selectedGeometries, this.map);
    }
  }

  render() {
    // Container div (id="map-leaflet") for leaflet map is created
    return (
      <div
        id="map-leaflet"
        className={classNames(styles.root, {
          [styles.fullScreen]: this.props.isFullScreen,
        })}
      />
    );
  }
}

export default MapLeaflet;
