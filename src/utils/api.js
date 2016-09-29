import memoize from "lodash.memoize";

const host = "http://localhost:8000/";

const parseLineNumber = lineId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    lineId.substring(1).replace(/^0+/, "");

const getRequest = (endpoint, id) => {
    const url = host + endpoint + (id || "");
    return fetch(url, {
        method: "GET",
        mode: "cors",
    })
    .then(response => response.json());
};

const fetchLines = memoize(() =>
    getRequest("lines").then((json) => {
        // Add the line number to each object
        const lines = Object.values(json);
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

export const getStopGeometries = memoize(routeId =>
    getRequest("stopGeometries/", routeId)
);

export const getRouteGeometries = memoize(routeId =>
    getRequest("routeGeometries/", routeId)
);

