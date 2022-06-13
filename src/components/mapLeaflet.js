import React from "react";
import classNames from "classnames";
import L from "leaflet";
import { first, last } from "lodash";
import "leaflet/dist/leaflet.css";
import { mapIcon, stopIcon } from "../utils/mapIcon";
import {
  closestPointCompareReducer,
  closestPointInGeometry,
} from "../utils/closestPoint";
import { circleMarker } from "leaflet";
import "mapillary-js/dist/mapillary.css";
import startIcon1 from "../icons/icon-suunta1.svg";
import startIcon2 from "../icons/icon-suunta2.svg";
import timeIcon1 from "../icons/icon-time1.svg";
import timeIcon2 from "../icons/icon-time2.svg";
import userLocationIcon from "../icons/icon-user-location.svg";
import locationIconOnline from "../icons/icon-location-online.svg";
import locationIconOffline from "../icons/icon-location-offline.svg";
import fullScreenEnterIcon from "../icons/icon-fullscreen-enter.svg";
import fullScreenExitIcon from "../icons/icon-fullscreen-exit.svg";
import restroomIcon from "../icons/restroom-solid.svg";
import styles from "./mapLeaflet.module.css";
import MapillaryViewer from "./MapillaryViewer.js";
import { isMobile } from "../utils/browser";

const MAX_DISTANCE_TO_RESTROOM = 500;

const addMarkersToLayer = (stops, direction, map, restrooms) => {
  /** Sets the correct icon based on direction (1 or 2),
    and what type of stop (regular, first stop or timing stop) **/
  let startIcon = startIcon1;
  let timeIcon = timeIcon1;
  if (direction === "2") {
    startIcon = startIcon2;
    timeIcon = timeIcon2;
  }

  const firstStop = first(stops);
  const lastStop = last(stops);
  if (firstStop.platform) {
    stops.unshift(firstStop);
  }

  stops.forEach((stop, index) => {
    let icon;
    if (index === 0) {
      icon = mapIcon(startIcon);
    } else if (stop.timingStopType > 0) {
      icon = mapIcon(timeIcon);
    } else {
      icon = stopIcon({
        centeredStop: stop.isCenteredStop && styles.centeredStop,
        color: stop.color,
        platform: stop.platform,
      });
    }

    const marker = L.marker([stop.lat, stop.lon], { icon });
    const tooltipContent = `${stop.shortId} ${stop.nameFi}${
      stop.platform ? `, lait. ${stop.platform}` : ""
    }`;
    marker.bindTooltip(tooltipContent, { direction: "top" });
    marker.addTo(map);
  });

  const firstStopMarkerLatLng = L.marker([firstStop.lat, firstStop.lon]).getLatLng();
  const lastStopMarkerLatLng = L.marker([lastStop.lat, lastStop.lon]).getLatLng();
  const closeByRestrooms = [];
  if (restrooms) {
    restrooms.forEach((restroom) => {
      const restroomMarker = L.marker([restroom.node.lat, restroom.node.lon]).getLatLng();
      const distanceFromFirstStop = firstStopMarkerLatLng.distanceTo(restroomMarker);
      const distanceFromLastStop = lastStopMarkerLatLng.distanceTo(restroomMarker);
      if (
        distanceFromFirstStop < MAX_DISTANCE_TO_RESTROOM ||
        distanceFromLastStop < MAX_DISTANCE_TO_RESTROOM
      ) {
        closeByRestrooms.push(restroom.node);
      }
    });
  }
  closeByRestrooms.forEach((closeByRestroom) => {
    let icon = mapIcon(restroomIcon);
    const markerr = L.marker([closeByRestroom.lat, closeByRestroom.lon], { icon });
    markerr.bindTooltip(`${closeByRestroom.nameFi}, ${closeByRestroom.addressFi}`, {
      direction: "top",
    });
    markerr.addTo(map);
  });
};

const addStopLayer = (routes, map, centeredStop, restrooms) => {
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
      map,
      restrooms
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

const addControlButton = (map, toggleFullscreen, resetMapillaryLocation) => {
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
        resetMapillaryLocation();
      };
      L.DomEvent.disableClickPropagation(container);
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
      L.DomEvent.disableClickPropagation(container);
      return container;
    },
  });
  map.addControl(new LocationControl());
};

const addMapillaryButton = (map, initMapillaryLayer) => {
  const MapillaryControl = L.Control.extend({
    options: {
      position: "topleft",
    },
    onAdd: () => {
      const icon = L.DomUtil.create("div");
      const container = L.DomUtil.create("button", "leaflet-bar leaflet-control");
      icon.height = "11";
      icon.width = "11";
      icon.innerHTML = "M";
      icon.style.fontSize = "15px";
      icon.style.fontWeight = "500";
      container.className = styles.controlButton;
      icon.style.color = isMobile ? "black" : "rgb(5, 203, 99)";
      container.appendChild(icon);
      container.onclick = () => {
        icon.style.color = initMapillaryLayer() ? "rgb(5, 203, 99)" : "black";
      };
      L.DomEvent.disableClickPropagation(container);
      return container;
    },
  });
  map.addControl(new MapillaryControl());
};

const addRouteFilterLayer = (map) => {
  const RouteFilterControl = L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: () => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-topright " + styles.filterArea
      );
      L.DomEvent.disableScrollPropagation(container);
      L.DomEvent.disableClickPropagation(container);
      return container;
    },
  });
  map.addControl(new RouteFilterControl());
};

const updateFilterLayer = (isFullScreen, isRouteFilterExpanded, mapillaryLocation) => {
  // This function moves all routeFilters from sidebar to map and vice versa
  const routeFilter = document.getElementsByClassName("leaflet-control-topright")[0];

  if (isFullScreen) {
    if (isRouteFilterExpanded && mapillaryLocation) {
      routeFilter.style.height = "45vh";
    } else {
      routeFilter.style.height = null;
    }
    for (const node of document.querySelectorAll(".route-filter")) {
      document.getElementsByClassName("leaflet-control-topright")[0].appendChild(node);
    }
  } else {
    for (const node of document.querySelectorAll(".route-filter")) {
      // Connect right routefilters to their lines by this id
      const lineIdPrefix = node.id.match(/_\d+.*/);
      document.getElementById("map-container" + lineIdPrefix).appendChild(node);
    }
  }
};

class MapLeaflet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationOn: false,
      locationMarker: null,
      showMapillaryLayer: !isMobile,
      mapillaryLocation: null,
      mapillaryImageLocation: null,
    };

    this.map = null;
    this.locationFound = false; // Class variable, because this doesn't affect the rendering.
    this.initializeMap = this.initializeMap.bind(this);
    this.addLayersToMap = this.addLayersToMap.bind(this);
    this.toggleLocation = this.toggleLocation.bind(this);
    this.initMapillaryLayer = this.initMapillaryLayer.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.onClick = this.onClick.bind(this);
    this.setMapillaryLocation = this.setMapillaryLocation.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.bindEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    // All layers except the base layer are removed when the component is updated
    this.map.eachLayer((layer) => {
      if (!layer.options.baseLayer) {
        if (
          layer.options.type !== "mapillaryGeoJsonLayer" &&
          layer.options.type !== "mapillaryImageMarker" &&
          layer.options.type !== "mapillaryHighlightMarker" &&
          !layer._layers
        ) {
          this.map.removeLayer(layer);
        }
      }
    });
    // Leaflet map is updated once geometry and stop data has been fetched
    // The view (bounding box) is set only the first time the route stops are recieved
    if (
      this.props.selectedRoutes.length > 0 &&
      this.props.selectedRoutes.length > prevProps.selectedRoutes.length &&
      this.props.routes &&
      this.props.routes[0]
    ) {
      const selected = this.props.routes.filter((r) =>
        this.props.selectedRoutes.includes(r.id)
      );
      const arrBounds = selected.reduce(
        (acc, curr) =>
          acc.concat(curr.routeSegments.nodes.map(({ stop }) => [stop.lat, stop.lon])),
        []
      );

      this.map.fitBounds(arrBounds);
    }

    if (prevProps.center !== this.props.center) {
      this.map.panTo(this.props.center);
    }

    this.addLayersToMap(this.map);

    // Add location marker to map if user location is on
    if (this.state.locationOn === true && this.state.locationMarker) {
      this.state.locationMarker.addTo(this.map);
    }

    if (this.props.selectedRoutes.length !== prevProps.selectedRoutes.length) {
      this.resetMapillaryLocation();
    }

    updateFilterLayer(
      this.props.isFullScreen,
      this.props.isRouteFilterExpanded,
      this.state.mapillaryLocation
    );
    this.map.invalidateSize();
  }

  bindEvents = () => {
    if (!this.map || this.eventsEnabled) {
      return;
    }

    this.map.on("click", this.onClick);
    this.map.on("mousemove", this.onHover);
    this.eventsEnabled = true;
  };

  unbindEvents = () => {
    if (!this.map || !this.eventsEnabled) {
      return;
    }

    this.map.off("click", this.onMapClick);
    this.map.off("mousemove", this.onHover);
    this.eventsEnabled = false;
  };

  removeMarker = () => {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
  };

  componentWillUnmount() {
    this.unbindEvents();
    this.removeMarker();
  }

  initMapillaryLayer() {
    const showMapillaryLayer = this.state.showMapillaryLayer;
    this.setState({ showMapillaryLayer: !showMapillaryLayer });
    return this.state.showMapillaryLayer;
  }

  toggleLocation() {
    const nextLocationOn = !this.state.locationOn;

    if (nextLocationOn) {
      const locationMarker = L.marker([0, 0], { icon: mapIcon(userLocationIcon) });
      this.map.on("locationfound", (e) => {
        locationMarker.setLatLng(e.latlng);
        // Update map only once when the location is received first time.
        if (!this.locationFound) {
          this.locationFound = true;
          this.props.setMapCenter(e.latlng);
        }
      });
      this.map.on("locationerror", (e) => {
        alert("Sijantia ei voitu määrittää. Tarkista selaimen ja laitteen asetukset.");
      });
      this.map.locate({ watch: true });
      this.setState({
        locationOn: nextLocationOn,
        locationMarker: locationMarker,
      });
    } else {
      this.map.off("locationfound");
      this.map.off("locationerror");
      this.map.stopLocate();
      this.locationFound = false;
      this.setState({
        locationOn: nextLocationOn,
        locationMarker: null,
      });
    }
    return nextLocationOn;
  }

  initializeMap() {
    const digitransitTileLayer = L.tileLayer(
      "https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}{retina}.png",
      {
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          'Map data: <a href="https://openmaptiles.org/">&copy; OpenMapTiles</a> ' +
          '<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>',
        retina: L.Browser.retina ? "@2x" : "", // Use @2x tiles for retina displays
        baseLayer: true,
      }
    );

    const aerialTileLayer = L.tileLayer(
      "https://ortophotos.blob.core.windows.net/hsy-map/hsy_tiles2/{z}/{x}/{y}.jpg",
      {
        maxZoom: 19,
        tileSize: 256,
        attribution:
          'Imagery: <a href="https://www.hsy.fi/">&copy; HSY 2021</a> ' +
          '<a href="https://www.maanmittauslaitos.fi/avoindata-lisenssi-cc40">&copy; Maamittauslaitos 2021</a>',
        detectRetina: true, // @2x tiles not available, use detectRetina -feature
        baseLayer: true,
      }
    );

    this.map = L.map("map-leaflet", {
      center: [60.170988, 24.940842],
      zoom: 13,
      layers: [digitransitTileLayer], // Digitransit layer as default
    });

    const baseMaps = {
      Aerial: aerialTileLayer,
      Digitransit: digitransitTileLayer,
    };

    L.control.layers(baseMaps).addTo(this.map);
    if (!isMobile) {
      addControlButton(
        this.map,
        this.props.toggleFullscreen,
        this.resetMapillaryLocation
      );
    }
    addLocationButton(this.map, this.toggleLocation);
    addMapillaryButton(this.map, this.initMapillaryLayer);
    addRouteFilterLayer(this.map);
  }

  async addLayersToMap() {
    if (this.props.routes) {
      const selectedStops = this.props.routes.filter((route) =>
        this.props.selectedRoutes.includes(
          `${route.name}_${route.routeId}_${route.direction}_${route.dateBegin}_${route.dateEnd}`
        )
      );
      addStopLayer(selectedStops, this.map, this.props.center, this.props.restrooms);

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

  onClick(e) {
    if (!this.state.showMapillaryLayer) {
      return;
    }
    for (const key in e.target._layers) {
      const layer = e.target._layers[key];
      if (layer) {
        if (layer.options.type === "mapillaryHighlightMarker") {
          this.setState({ mapillaryLocation: layer._latlng });
        }
      }
    }
  }

  setMapillaryLocation(position, playService) {
    if (!this.state.mapillaryLocation) {
      if (playService) {
        playService.stop();
      }
      return;
    }
    if (this.imageMarker) {
      this.imageMarker.remove();
      this.imageMarker = null;
    }
    if (this.map && position) {
      const marker = this.createMarker({
        position: position,
        opacity: 1,
        type: "mapillaryImageMarker",
        color: "red",
      });
      if (!this.imageMarker) {
        this.imageMarker = marker;
        this.imageMarker.addTo(this.map);
      } else {
        this.imageMarker.setLatLng(position);
      }
    } else if (!position) {
      this.removeMarker();
    }
    this.setState({ mapillaryImageLocation: { lat: position.lat, lng: position.lon } });
  }

  onHover = (e) => {
    if (!this.state.showMapillaryLayer) {
      return;
    }
    const { latlng } = e;
    const features = [];
    this.map.eachLayer((layer) => {
      if (layer.feature && layer.feature.geometry) {
        features.push(layer.feature);
      }
    });
    if (!features.length) {
      return;
    }

    // Get the feature closest to where the user is hovering
    let featurePoint = closestPointCompareReducer(
      features,
      (feature) => closestPointInGeometry(latlng, feature.geometry, 200),
      latlng
    );
    this.highlightedLocation = featurePoint;

    featurePoint = featurePoint && !featurePoint.equals(latlng) ? featurePoint : false;
    this.highlightMapillaryPoint(featurePoint);
  };

  createMarker = (options) => {
    return circleMarker(options.position, {
      type: options.type,
      radius: 4,
      color: options.color,
      opacity: options.opacity,
    });
  };

  highlightMapillaryPoint = (position) => {
    if (this.mapillaryHighlightMarker) {
      this.mapillaryHighlightMarker.remove();
      this.marker = null;
    }

    if (this.map && position) {
      const marker = this.createMarker({
        position: position,
        opacity: 0.25,
        type: "mapillaryHighlightMarker",
        color: "red",
      });
      this.mapillaryHighlightMarker = marker;
      this.mapillaryHighlightMarker.addTo(this.map);
    } else if (!position) {
      this.removeMarker();
    }
  };

  resetMapillaryLocation = () => {
    this.map.eachLayer((layer) => {
      if (!layer.options.baseLayer) {
        this.map.removeLayer(layer);
      }
    });
    this.setState({ mapillaryLocation: null });
  };

  render() {
    return (
      <div
        className={classNames(styles.container, {
          [styles.containerMobile]: isMobile,
        })}>
        <div
          id="map-leaflet"
          className={classNames(styles.root, {
            [styles.fullScreen]: this.props.isFullScreen,
            [styles.printableMap]: this.props.showPrintLayout,
          })}
        />
        {this.state.mapillaryLocation && (
          <MapillaryViewer
            onCloseViewer={this.resetMapillaryLocation}
            elementId="mly"
            onNavigation={this.setMapillaryLocation}
            location={this.state.mapillaryLocation}
          />
        )}
      </div>
    );
  }
}

export default MapLeaflet;
