import React from "react";
import classNames from "classnames";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapIcon, stopIcon } from "../utils/mapIcon";
import {
  closestPointCompareReducer,
  closestPointInGeometry,
} from "../utils/closestPoint";
import { circleMarker } from "leaflet";
import "mapillary-js/dist/mapillary.min.css";
import startIcon1 from "../icons/icon-suunta1.svg";
import startIcon2 from "../icons/icon-suunta2.svg";
import timeIcon1 from "../icons/icon-time1.svg";
import timeIcon2 from "../icons/icon-time2.svg";
import userLocationIcon from "../icons/icon-user-location.svg";
import locationIconOnline from "../icons/icon-location-online.svg";
import locationIconOffline from "../icons/icon-location-offline.svg";
import fullScreenEnterIcon from "../icons/icon-fullscreen-enter.svg";
import fullScreenExitIcon from "../icons/icon-fullscreen-exit.svg";
import styles from "./mapLeaflet.module.css";
import MapillaryViewer from "./MapillaryViewer.js";

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
      icon = mapIcon(startIcon);
    } else if (stop.timingStopType > 0) {
      icon = mapIcon(timeIcon);
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
      container.className = styles.controlButton;
      container.appendChild(icon);
      container.onclick = () => {
        initMapillaryLayer();
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
      position: "bottomright",
    },
    onAdd: () => {
      const container = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-bottomright " + styles.filterArea
      );
      L.DomEvent.disableScrollPropagation(container);
      L.DomEvent.disableClickPropagation(container);
      return container;
    },
  });
  map.addControl(new RouteFilterControl());
};

const updateFilterLayer = (isFullScreen) => {
  // This function moves all routeFilters from sidebar to map and vice versa
  if (isFullScreen) {
    for (const node of document.querySelectorAll(".route-filter")) {
      document.getElementsByClassName("leaflet-control-bottomright")[0].appendChild(node);
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
      showMapillaryLayer: false,
      mapillaryLocation: null,
    };

    this.map = null;
    this.locationFound = false; // Class variable, because this doesn't affect the rendering.
    this.initializeMap = this.initializeMap.bind(this);
    this.addLayersToMap = this.addLayersToMap.bind(this);
    this.toggleLocation = this.toggleLocation.bind(this);
    this.initMapillaryLayer = this.initMapillaryLayer.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDrag = this.onDrag.bind(this);
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

    updateFilterLayer(this.props.isFullScreen);
    this.map.invalidateSize();
  }

  bindEvents = () => {
    if (!this.map || this.eventsEnabled) {
      return;
    }

    this.map.on("dragend", this.onDrag);
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

  async initMapillaryLayer() {
    if (this.state.showMapillaryLayer) {
      this.map.eachLayer((layer) => {
        if (
          layer.feature &&
          layer.feature.properties &&
          layer.feature.properties.camera_make
        ) {
          this.map.removeLayer(layer);
        }
      });
      this.setState({ showMapillaryLayer: false });
      return false;
    }
    this.setState({ showMapillaryLayer: true });
    const data = await this.fetchMapillaryFeatures();

    data.features.forEach((route) => {
      L.geoJson(route, {
        type: "mapillaryGeoJsonLayer",
        style: (feature) => {
          return {
            color: "#00b3b3",
            opacity: 0.8,
          };
        },
      }).addTo(this.map);
    });
    return true;
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

  fetchMapillaryFeatures = async () => {
    const bounds = this.map.getBounds();
    const bboxStr = `${bounds
      .getSouthWest()
      .lng.toFixed(6)},${bounds
      .getSouthWest()
      .lat.toFixed(6)},${bounds
      .getNorthEast()
      .lng.toFixed(6)},${bounds.getNorthEast().lat.toFixed(6)}`;
    const url = `https://a.mapillary.com/v3/sequences?bbox=${bboxStr}&client_id=V2RqRUsxM2dPVFBMdnlhVUliTkM0ZzoxNmI5ZDZhOTc5YzQ2MzEw&per_page=1000&start_time=2019-08-01&organization_keys=mstFdbqROWkgC2sNNU2tZ1`;
    const request = await fetch(url);
    const data = await request.json();
    return data;
  };

  async onDrag(e) {
    if (!this.state.showMapillaryLayer) return;
    const data = await this.fetchMapillaryFeatures();
    const currentFeatures = {};
    for (const key in e.target._layers) {
      const layer = e.target._layers[key];
      if (layer && layer.feature && layer.feature.properties) {
        currentFeatures[layer.feature.properties.key] = layer;
      }
    }
    data.features.forEach((feature) => {
      if (!currentFeatures[feature.properties.key]) {
        L.geoJson(feature, {
          type: "mapillaryGeoJsonLayer",
          style: () => {
            return {
              color: "#00b3b3",
              opacity: 0.8,
            };
          },
        }).addTo(this.map);
      }
    });
  }

  onClick(e) {
    for (const key in e.target._layers) {
      const layer = e.target._layers[key];
      if (layer) {
        if (layer.options.type === "mapillaryHighlightMarker") {
          this.setState({ mapillaryLocation: layer._latlng });
        }
      }
    }
  }

  onHover = (e) => {
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

  createMarker = (position) => {
    return circleMarker(position, {
      type: "mapillaryHighlightMarker",
      radius: 4,
      color: "red",
    });
  };

  highlightMapillaryPoint = (position) => {
    if (this.map && position) {
      const marker = this.marker || this.createMarker(position);
      if (!this.marker) {
        this.marker = marker;
        this.marker.addTo(this.map);
      } else {
        this.marker.setLatLng(position);
      }
    } else if (!position) {
      this.removeMarker();
    }
  };

  resetMapillaryLocation = () => {
    this.setState({ mapillaryLocation: null });
  };

  render() {
    return (
      <div className={classNames(styles.container)}>
        <div
          id="map-leaflet"
          className={classNames(styles.root, {
            [styles.fullScreen]: this.props.isFullScreen,
          })}
        />
        {this.state.mapillaryLocation && (
          <MapillaryViewer
            onCloseViewer={this.resetMapillaryLocation}
            elementId="mly"
            onNavigation={() => {}}
            location={this.state.mapillaryLocation}
          />
        )}
      </div>
    );
  }
}

export default MapLeaflet;
