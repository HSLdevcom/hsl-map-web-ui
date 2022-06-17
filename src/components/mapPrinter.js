import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./mapPrinter.module.css";
import { generateStyle } from "hsl-map-style";
import dayjs from "dayjs";
import classNames from "classnames";

const PIXEL_DENSITY = 3;

const DOCUMENT_ORIENTATION = {
  PORTRAIT: "Pysty",
  LANDSCAPE: "Vaaka",
};

const DOCUMENT_SIZES = {
  A2: { title: "A2 Pysty", size: [420, 594], rotation: DOCUMENT_ORIENTATION.PORTRAIT },
  A2_portrait: {
    title: "A2 Vaaka",
    size: [594, 420],
    rotation: DOCUMENT_ORIENTATION.LANDSCAPE,
  },
  A3: { title: "A3 Pysty", size: [297, 420], rotation: DOCUMENT_ORIENTATION.PORTRAIT },
  A3_portrait: {
    title: "A3 Vaaka",
    size: [420, 297],
    rotation: DOCUMENT_ORIENTATION.LANDSCAPE,
  },
  A4: { title: "A4 Pysty", size: [210, 297], rotation: DOCUMENT_ORIENTATION.PORTRAIT },
  A4_portrait: {
    title: "A4 Vaaka",
    size: [297, 210],
    rotation: DOCUMENT_ORIENTATION.LANDSCAPE,
  },
};

const getHSLStyle = (selectedRoutes, date) => {
  const printRoutes = selectedRoutes.length > 0 ? true : false;
  return generateStyle({
    sourcesUrl: "https://cdn.digitransit.fi/", // <-- You can override the default sources URL.
    components: {
      // Set each layer you want to include to true

      // Styles
      base: { enabled: true }, // Enabled by default
      municipal_borders: { enabled: false },
      routes: { enabled: printRoutes },
      text: { enabled: true }, // Enabled by default
      subway_entrance: { enabled: false },
      poi: { enabled: false },
      park_and_ride: { enabled: false },
      ticket_sales: { enabled: false },
      stops: { enabled: printRoutes },
      citybikes: { enabled: false },
      ticket_zones: { enabled: false },
      ticket_zone_labels: { enabled: false },

      // Themes
      text_sv: { enabled: false },
      text_fisv: { enabled: false },
      regular_routes: { enabled: false },
      near_bus_routes: { enabled: false },
      routes_with_departures_only: { enabled: false }, // Enabled by default. Doesn't do anything until routes is enabled.
      regular_stops: { enabled: false },
      near_bus_stops: { enabled: false },
      print: { enabled: true },
      greyscale: { enabled: false },
      simplified: { enabled: false },
      "3d": { enabled: false },
      driver_info: { enabled: true },
    },

    // optional property to filter routes
    routeFilter: selectedRoutes,
    // optional property to change the date of routes and stops
    joreDate: date,
  });
};

class MapPrinter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      printModeOn: false,
      fetchingPrints: false,
    };
    this.printToolBar = this.addPrintToolbox();
    this.printButton = null;

    this.addMapPrinter();
  }

  addMapPrinter() {
    const editableLayers = new L.FeatureGroup();
    this.props.map.addLayer(editableLayers);

    const options = {
      position: "topleft",
      edit: {
        featureGroup: editableLayers,
        remove: false,
      },
    };

    const PrintToggleButton = L.Control.extend({
      options: options,
      onAdd: () => {
        const icon = L.DomUtil.create("div");
        const container = L.DomUtil.create("button", "leaflet-bar leaflet-control");
        icon.innerHTML = "🖨️";
        icon.height = "11";
        icon.width = "11";
        container.className = styles.controlButton;
        container.appendChild(icon);
        container.onclick = () => {
          this.togglePrintMode();
        };
        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });
    this.props.map.addControl(new PrintToggleButton());
  }

  addPrintToolbox() {
    const options = {
      position: "topleft",
    };
    const PrintToolBar = L.Control.extend({
      options: options,
      onAdd: () => {
        const container = L.DomUtil.create("div");
        const docButtonContainer = L.DomUtil.create("div", "", container);
        container.className = styles.printToolContainer;
        docButtonContainer.className = styles.documentButtonContainer;
        this.createDocumentButtons(docButtonContainer);
        this.createClearAllMarkersButton(container);
        this.createPrintButton(container);
        L.DomEvent.disableClickPropagation(container);
        return container;
      },
    });
    return new PrintToolBar();
  }

  createDocumentButtons(container) {
    Object.entries(DOCUMENT_SIZES).forEach((entry) => {
      const printButton = L.DomUtil.create("button", "", container);
      L.DomEvent.addListener(printButton, "click", () =>
        this.addDocumentOutline(entry[1])
      );
      printButton.className = styles.printToolButton;
      printButton.innerText = entry[1].title;
    });
  }

  createClearAllMarkersButton(container) {
    const clearAllButton = L.DomUtil.create("button", "", container);
    L.DomEvent.addListener(clearAllButton, "click", () => this.clearMarkers());
    clearAllButton.className = styles.clearMarkersButton;
    clearAllButton.innerText = "TYHJENNÄ";
  }

  createPrintButton(container) {
    const printPagesButton = L.DomUtil.create("button", "leaflet-control", container);
    L.DomEvent.addListener(printPagesButton, "click", () => this.fetchImages());
    printPagesButton.className = classNames([styles.printPagesButton, styles.disabled]);
    printPagesButton.innerText = "TULOSTA KUVAT";
    this.printButton = printPagesButton;
  }

  togglePrintMode() {
    const nextState = !this.state.printModeOn;
    if (nextState) {
      this.props.map.addControl(this.printToolBar);
    } else {
      this.clearMarkers();
      this.props.map.removeControl(this.printToolBar);
    }
    this.setState({ printModeOn: nextState });
    this.updateButtonState();
  }

  addDocumentOutline(document) {
    const mapCenterLatLng = this.props.map.getCenter();
    this.drawDocumentMarker(document, mapCenterLatLng);
    this.updateButtonState();
  }

  drawDocumentMarker = (document, markerPosition) => {
    const printIcon = L.divIcon({
      className: styles.printIcon,
      iconSize: [document.size[0] * PIXEL_DENSITY, document.size[1] * PIXEL_DENSITY],
    });

    const printMarker = L.marker(markerPosition, {
      icon: printIcon,
      color: "#ff7800",
      weight: 1,
      draggable: true,
      documentProps: document,
    });
    this.props.documentMarkerGroup.addLayer(printMarker);
    printMarker.addTo(this.props.map);
  };

  updateButtonState = () => {
    if (this.printButton) {
      if (this.state.fetchingPrints) {
        this.printButton.innerText = "LADATAAN KUVIA...";
        this.printButton.disabled = true;
        L.DomUtil.addClass(this.printButton, styles.disabled);
      } else {
        this.printButton.innerText = "TULOSTA KUVAT";
        if (this.props.documentMarkerGroup.getLayers().length > 0) {
          this.printButton.disabled = false;
          L.DomUtil.removeClass(this.printButton, styles.disabled);
        } else {
          this.printButton.disabled = true;
          L.DomUtil.addClass(this.printButton, styles.disabled);
        }
      }
    }
  };

  clearMarkers = () => {
    this.props.documentMarkerGroup.clearLayers();
    this.updateButtonState();
  };

  fetchImages() {
    this.setState({ fetchingPrints: true });
    this.updateButtonState();
    const selectedRoutes = this.props.routes.filter((r) =>
      this.props.selectedRoutes.includes(r.id)
    );
    const routeFilters = selectedRoutes.map((selectedRoute) => {
      return { id: selectedRoute.routeId, direction: selectedRoute.direction };
    });

    const filterDate = this.props.routes.find((route) => {
      const present = dayjs(new Date());
      const routeDateBegin = dayjs(route.dateBegin);
      return present.isBefore(routeDateBegin);
    });

    const style = getHSLStyle(
      routeFilters,
      filterDate ? filterDate.dateBegin : new Date()
    );

    if (this.props.documentMarkerGroup.getLayers().length > 0) {
      const fetchJobs = [];

      this.props.documentMarkerGroup.getLayers().forEach((document) => {
        const latLng = document.getLatLng();
        const documentProps = document.options.documentProps;
        const options = {
          center: [latLng.lng, latLng.lat],
          width: documentProps.size[0] * 2.95,
          height: documentProps.size[1] * 2.95,
          zoom: this.props.map.getZoom() - 1,
          scale: 4.166666666666667,
          pitch: 0,
          bearing: 0,
          meterPerPxRatio: PIXEL_DENSITY,
        };
        const timestamp = dayjs(new Date()).format("DD-MM-YY");

        fetchJobs.push(
          fetch("https://dev.kartat.hsl.fi/map-generator/generateImage", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              options,
              style,
            }),
            headers: {
              "Content-Type": "application/json",
              "Accept-Encoding": "gzip, deflate, br",
            },
          })
            .then((response) => {
              return response.blob();
            })
            .then((blob) => {
              // Create a link element that is used to download the picture
              const a = window.document.createElement("a");
              a.download = `tuloste-${timestamp}.png`;
              a.href = window.URL.createObjectURL(blob);

              window.document.body.appendChild(a);
              a.click();
              window.document.body.removeChild(a);
            })
            .catch((err) => console.error(err))
        );
      });

      Promise.all(fetchJobs).then(() => {
        this.setState({ fetchingPrints: false });
        this.updateButtonState();
      });
    } else {
      alert("Ei yhtäkään kuvaa valittuna !");
    }
  }

  render() {
    return <p className={styles.dummyElement} />;
  }
}

export default MapPrinter;
