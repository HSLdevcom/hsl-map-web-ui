import L from "leaflet";

export function routeIcon(url) {
    return L.icon({
        iconSize: [27, 27],
        iconAnchor: [13, 27],
        popupAnchor: [1, -24],
        iconUrl: url,
    });
}

export function stopIcon(name) {
    return L.divIcon({
        className: name,
    });
}
