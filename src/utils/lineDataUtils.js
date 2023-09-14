// Util functions to handle line data.

const parseLineNumber = (lineId) =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const parseTransportType = (line) => {
  if (line.routes.nodes.length > 0) {
    return line.routes.nodes[0].mode;
  }
  // Backup if mode not found from routes. The old hardcoded way.
  if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
    return "TRAM";
  }
  return "BUS";
};

const compareLineNameOrder = (a, b) => {
  if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
    return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
  } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
    return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
  }
  return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
};

export { parseLineNumber, parseTransportType, compareLineNameOrder };
