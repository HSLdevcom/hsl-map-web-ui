import L from "leaflet";

export function mapIcon(iconUrl) {
  return L.icon({
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -35],
    iconUrl,
  });
}

export function stopIcon(props) {
  const { centeredStop, color, platform } = props;
  const marker = L.divIcon({
    className: "stopIcon",
    html: `<div style=" border: solid ${
      centeredStop ? "5px" : "3px"
    } ${color}; top: -3px; position: relative; left: -3px;height: 15px; width: 15px; background-color: white; border-radius: 24px; font-size: 10px; font-weight: bold; text-align: center;">${
      platform ? platform : ""
    }</div>`,
  });
  return marker;
}
