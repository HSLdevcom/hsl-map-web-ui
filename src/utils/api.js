import { memoize } from "lodash";
import urljoin from "url-join";

const removeTrains = lines =>
    lines.filter(line => line.lineId.substring(0, 1) !== "3");

const setTransportType = lines =>
    lines.map((line) => {
        if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
            line.transportType = "tram";
        } else {
            line.transportType = "bus";
        }
        return line;
    });

const parseLineNumber = lineId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    lineId.substring(1).replace(/^0+/, "");

const getRequest = (endpoint, id) =>
    fetch(urljoin(process.env.API_URL, endpoint, id), {
        method: "GET",
        mode: "cors",
    })
    .then(response => response.json());

const fetchLines = memoize(() =>
    getRequest("lines").then((json) => {
        const lines = setTransportType(removeTrains(Object.values(json)));
        // Add the line number to each object
        lines.forEach((line) => {
            line.lineNumber = parseLineNumber(line.lineId);
        });
        return lines;
    })
);

export const getLines = () =>
    fetchLines().then(lines => lines);

export const getLine = id =>
    fetchLines().then(lines => lines.find(line => line.lineId === id));

export const getRoutes = memoize(lineId =>
    getRequest("routesByLine", lineId)
);

export const getStopGeometries = memoize(routeId =>
    getRequest("stopGeometries", routeId)
);

export const getRouteGeometries = memoize(routeId =>
    getRequest("routeGeometries", routeId)
);
