import L from "leaflet";

export function routeIcon(baseUrl, direction) {
    return L.icon({
        iconSize: [27, 27],
        iconAnchor: [13, 27],
        popupAnchor: [1, -24],
        iconUrl: baseUrl + direction + ".svg",
    });
}

export function stopIcon(name, directionStyle) {
    return L.divIcon({
        className: name + " " + directionStyle,
    });
}
