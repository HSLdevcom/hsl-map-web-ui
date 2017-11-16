import L from "leaflet";

export function routeIcon(iconUrl) {
    return L.icon({
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        tooltipAnchor: [0, -35],
        iconUrl,
    });
}

export function stopIcon(className, directionClassName, centeredStop) {
    return L.divIcon({
        className: `${className} ${directionClassName} ${centeredStop}`,
        tooltipAnchor: [0, -10],
    });
}
