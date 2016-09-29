import memoize from "lodash.memoize";

const parseLineNumber = lineId =>
    // Remove 1st number, which represents the city
    // Remove all zeros from the beginning
    lineId.substring(1).replace(/^0+/, "");

export const getLines = memoize(() =>
    fetch("http://localhost:8000/lines", {
        method: "GET",
        mode: "cors",
    })
    .then(response => response.json())
    .then((json) => {
        // Add the line number to each object
        const lines = Object.values(json);
        lines.forEach((line) => {
            line.lineNumber = parseLineNumber(line.lineId);
        });
        return lines;
    })
);

