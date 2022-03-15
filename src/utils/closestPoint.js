import { latLng } from "leaflet";

export function closestPointInGeometry(queryPoint, geometry, maxDistance = 100) {
  const queryLatLng = latLng(queryPoint);

  if (geometry.type === "LineString") {
    return closestPointOnLine(queryLatLng, geometry.coordinates, maxDistance);
  } else if (geometry.type === "MultiLineString") {
    return closestPointCompareReducer(
      geometry.coordinates,
      (coordinate) => closestPointOnLine(queryLatLng, coordinate, maxDistance),
      queryLatLng
    );
  }

  return false;
}

export function closestPointCompareReducer(collection, getCandidate, latlng) {
  return collection.reduce((current, item) => {
    const pointCandidate = getCandidate(item);

    if (
      !current ||
      (!!pointCandidate && latlng.distanceTo(pointCandidate) < latlng.distanceTo(current))
    ) {
      return pointCandidate;
    }

    return current;
  }, false);
}

function closestPointOnLine(queryPoint, lineGeometry, maxDistance = 100) {
  let prevDistance = maxDistance;
  let closestPoint = false;

  for (let i = 0; i < lineGeometry.length; i++) {
    const [lng, lat] = lineGeometry[i];
    const distanceFromQuery = queryPoint.distanceTo([lat, lng]);

    if (distanceFromQuery < prevDistance) {
      prevDistance = distanceFromQuery;
      closestPoint = latLng([lat, lng]);
    }
  }

  return closestPoint;
}
