import React from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import { first } from "lodash";
import CircularProgress from "material-ui/CircularProgress";
import "leaflet-path-drag";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./mapPrinter.module.css";
import { generateStyle } from "hsl-map-style";
import {
  mapSelectionToZoom,
  mapSelectionToTileScale,
  mapSelectionToPixelSize,
  mapSelectionToBbox,
  mapSelectionToMeterPerPixelRatio,
} from "../utils/geom-utils";

const DOCUMENT_SIZES = {
  A4: {
    width: 210,
    height: 297,
  },
  A3: {
    width: 297,
    height: 420,
  },
  A2: {
    width: 420,
    height: 594,
  },
};

const getHSLStyle = (selectedRoutes, date) => {
  const printRoutes = selectedRoutes.length > 0 ? true : false;
  return generateStyle({
    sourcesUrl: "https://cdn.digitransit.fi/",
    components: {
      base: { enabled: true },
      municipal_borders: { enabled: false },
      routes: { enabled: printRoutes },
      text: { enabled: true },
      subway_entrance: { enabled: false },
      poi: { enabled: false },
      park_and_ride: { enabled: false },
      ticket_sales: { enabled: false },
      stops: { enabled: printRoutes },
      citybikes: { enabled: false },
      ticket_zones: { enabled: false },
      ticket_zone_labels: { enabled: false },

      text_sv: { enabled: false },
      text_fisv: { enabled: false },
      regular_routes: { enabled: false },
      near_bus_routes: { enabled: false },
      routes_with_departures_only: { enabled: false },
      regular_stops: { enabled: false },
      near_bus_stops: { enabled: false },
      print: { enabled: true },
      greyscale: { enabled: false },
      simplified: { enabled: false },
      "3d": { enabled: false },
      driver_info: { enabled: true },
    },

    routeFilter: selectedRoutes,
    joreDate: date,
  });
};

class MapPrinter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      mapSelection: {
        center: [24.9, 60.2],
        width: 210,
        height: 297,
        dpi: 300,
        mapScale: 10000,
        pixelScale: 1,
      },
    };
  }

  componentDidMount() {
    this.drawDocumentMarker();
  }

  componentWillUnmount() {
    this.clearMarkers();
  }

  componentDidUpdate() {
    this.redraw();
  }

  handleChange = (e) => {
    const { mapSelection } = this.state;
    mapSelection[e.target.id] = e.target.value;
    this.setState({ mapSelection });
  };

  onSliderChange = (e) => {
    const { mapSelection } = this.state;
    mapSelection.mapScale = e.target.value;
    this.setState({ mapSelection });
  };

  onSizeChange = (documentSize) => {
    const { mapSelection } = this.state;
    mapSelection.width = documentSize.width;
    mapSelection.height = documentSize.height;
    this.setState({ mapSelection });
  };

  onSizeFlip = () => {
    const { mapSelection } = this.state;
    const width = mapSelection.width;
    const height = mapSelection.height;
    mapSelection.width = height;
    mapSelection.height = width;
    this.setState({ mapSelection });
  };

  onPrint = () => {
    this.fetchImages();
  };

  drawDocumentMarker = () => {
    const { mapSelection } = this.state;
    const centerLatLng = this.props.map.getCenter();
    mapSelection.center = [centerLatLng.lng, centerLatLng.lat];
    const bbox = mapSelectionToBbox(mapSelection);
    const rectOptions = { color: "Red", weight: 1, draggable: true };
    const rectangle = L.rectangle(bbox, rectOptions);

    rectangle.on("dragend", (e) => {
      const { mapSelection } = this.state;
      const center = e.target.getBounds().getCenter();
      mapSelection.center = [center.lng, center.lat];
      this.setState({ mapSelection });
    });

    this.props.documentMarkerGroup.addLayer(rectangle);
    rectangle.addTo(this.props.map);
    this.setState({ mapSelection });
  };

  redraw = () => {
    const { mapSelection } = this.state;
    const bbox = mapSelectionToBbox(mapSelection);
    const printLayer = first(this.props.documentMarkerGroup.getLayers());
    printLayer.setBounds(bbox);
  };

  clearMarkers = () => {
    this.props.documentMarkerGroup.clearLayers();
  };

  fetchImages = async () => {
    this.setState({ fetching: true });
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

    const { mapSelection } = this.state;
    const tileScale = mapSelectionToTileScale(mapSelection);
    const options = {
      center: mapSelection.center,
      width: Math.round(mapSelectionToPixelSize(mapSelection)[0] / tileScale),
      height: Math.round(mapSelectionToPixelSize(mapSelection)[1] / tileScale),
      zoom: mapSelectionToZoom(mapSelection) - 1,
      scale: tileScale,
      pitch: 0,
      bearing: 0,
      meterPerPxRatio: mapSelectionToMeterPerPixelRatio(mapSelection),
    };

    try {
      const response = await fetch(
        "https://dev.kartat.hsl.fi/map-generator/generateImage",
        {
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
        }
      );

      const blob = await response.blob();
      const a = window.document.createElement("a");
      const timestamp = dayjs(new Date()).format("DD-MM-YY");
      a.download = `tuloste-${timestamp}.png`;
      a.href = window.URL.createObjectURL(blob);
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } catch (e) {
      console.log(e);
    }

    this.setState({ fetching: false });
  };

  render() {
    const { mapSelection, fetching } = this.state;

    return (
      <div className={styles.mapPrinterContainer}>
        <div className={styles.printTitle}>Fyysinen koko</div>
        <div className={styles.sizeButtonsContainer}>
          <button
            className={styles.sizeButton}
            onClick={() => this.onSizeChange(DOCUMENT_SIZES.A4)}>
            A4
          </button>
          <button
            className={styles.sizeButton}
            onClick={() => this.onSizeChange(DOCUMENT_SIZES.A3)}>
            A3
          </button>
          <button
            className={styles.sizeButton}
            onClick={() => this.onSizeChange(DOCUMENT_SIZES.A2)}>
            A2
          </button>
        </div>
        <button className={styles.sizeButton} onClick={() => this.onSizeFlip()}>
          Käännä
        </button>
        <div className={styles.sizeButtonContainer}>
          <input
            id="width"
            className={styles.printInput}
            onChange={(e) => this.handleChange(e)}
            value={mapSelection.width}
            autoComplete="off"
          />
          <div className={styles.sizeText}>x</div>
          <input
            id="height"
            className={styles.printInput}
            onChange={(e) => this.handleChange(e)}
            value={mapSelection.height}
            autoComplete="off"
          />
          <div className={styles.sizeText}>mm</div>
        </div>
        <div className={styles.divider} />
        <div>
          <div className={styles.printTitle}>Mittakaava</div>
          <input
            id="mapScale"
            className={styles.printInput}
            onChange={(e) => this.handleChange(e)}
            value={mapSelection.mapScale}
            autoComplete="off"
          />
          <div className="slidecontainer">
            <input
              onChange={(e) => this.onSliderChange(e)}
              className={styles.customSlider}
              type="range"
              min="1"
              max="30000"
              value={this.state.mapSelection.mapScale}
            />
          </div>
        </div>
        <div className={styles.divider} />
        <div>
          <div className={styles.printTitle}>DPI</div>
          <input
            id="dpi"
            className={styles.printInput}
            onChange={(e) => this.handleChange(e)}
            value={this.state.mapSelection.dpi}
            autoComplete="off"
          />
        </div>
        <div className={styles.divider} />
        <button
          className={classNames(styles.printButton, { [styles.disabled]: !fetching })}
          disabled={fetching}
          onClick={(e) => this.onPrint(e)}>
          {fetching ? (
            <CircularProgress
              size={20}
              style={{ display: "block", margin: "auto", color: "grey" }}
            />
          ) : (
            "Tulosta"
          )}
        </button>
      </div>
    );
  }
}

export default MapPrinter;
