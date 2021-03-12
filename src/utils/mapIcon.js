import L from "leaflet";

export function routeIcon(iconUrl) {
  return L.icon({
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -35],
    iconUrl,
  });
}

export function stopIcon(centeredStop, color) {
  const marker = L.divIcon({
    className: "stopIcon",
    html: `<div style=" border: solid ${
      centeredStop ? "5px" : "3px"
    } ${color}; top: -3px; position: relative; left: -3px;height: 12px; width: 12px; background-color: white; border-radius: 24px;"></div>`,
  });
  return marker;
}
