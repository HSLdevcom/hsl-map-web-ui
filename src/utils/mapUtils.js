import * as turf from "@turf/turf";

const IMAGE_COMPASS_ANGLE_THRESHOLD = 20;

const wait = async (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const fetchRetry = async (url, delay, tries, fetchOptions = {}) => {
  const triesLeft = tries - 1;
  if (!triesLeft) {
    throw new Error("Mapillary image fetch failed");
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    await wait(delay);
    return await fetchRetry(url, delay, triesLeft, fetchOptions);
  }
  return res;
};


const bearingToCompassAngle = (bearing) => {
  const compassAngle = (bearing + 360) % 360;
  return compassAngle;
};

export async function getCompassAngle({ closestCoordinate, nextCoordinate }) {
  const startPoint = turf.point(closestCoordinate);
  const endPoint = turf.point(nextCoordinate);

  const bearing = turf.bearing(startPoint, endPoint);

  const compassAngle = bearingToCompassAngle(bearing);

  return compassAngle;
}

export async function getClosestMapillaryImage({ lat, lng, selectedRoutes }) {

  const p = turf.point([lng, lat]);
  const buffer = turf.buffer(p, 0.05, { units: "kilometers" });
  const bbox = turf.bbox(buffer);

  const pointsWithGeometry = [];

  selectedRoutes.forEach((route) => {
    route.geometries.nodes[0].geometry.coordinates.forEach((coord) => {
        pointsWithGeometry.push({
          point: turf.point(coord),
          geometry: route.geometries.nodes[0].geometry.coordinates,
        });
    });
  });

  const pointsCollection = turf.featureCollection(pointsWithGeometry.map(pg => pg.point));

  const nearest = turf.nearestPoint(p, pointsCollection);

  const nearestGeometry = pointsWithGeometry.find(pg => 
    pg.point.geometry.coordinates[0] === nearest.geometry.coordinates[0] &&
    pg.point.geometry.coordinates[1] === nearest.geometry.coordinates[1]
  ).geometry;

  let nextCoordinate;
  const nearestCoordIndex = nearestGeometry.findIndex(coord =>
    coord[0] === nearest.geometry.coordinates[0] &&
    coord[1] === nearest.geometry.coordinates[1]
  );

  if (nearestCoordIndex >= 0 && nearestCoordIndex < nearestGeometry.length - 5) {
    nextCoordinate = nearestGeometry[nearestCoordIndex + 5];
  } else {
    nextCoordinate = nearest.geometry.coordinates;
  }

  const closestCoordinateCompassAngle = await getCompassAngle({closestCoordinate: nearest.geometry.coordinates, nextCoordinate})
  const url = `https://graph.mapillary.com/images?fields=id,geometry,compass_angle,detection&bbox=${bbox}&limit=100`;
  const delay = 500;
  const tries = 3;

  const fetchOptions = {
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_MAPILLARY_CLIENT_TOKEN}`,
    },
  };

  let authResponse = await fetchRetry(
    `${url}&organization_id=227572519135262`,
    delay,
    tries,
    fetchOptions
  );
  let json = await authResponse.json();

  //If we get no images with organization_id then try fetching without it
  if (json.data.length === 0) {
    const res = await fetch(url, fetchOptions);
    json = await res.json();
  }

  if (!json.data) {
    return null;
  }

  let closest;
  json.data.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    let distance = Math.hypot(
      Math.abs(lat - coordinates[1]),
      Math.abs(lng - coordinates[0])
    );
    const angleDifference = Math.abs(feature.compass_angle - closestCoordinateCompassAngle);
    const angleOffBy = Math.min(angleDifference, 360 - angleDifference);
    if ((!closest || distance < closest.distance) && angleOffBy <= IMAGE_COMPASS_ANGLE_THRESHOLD) {
      closest = feature;
      closest.distance = distance;
    }
  });
  return closest;
}
