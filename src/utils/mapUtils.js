import * as turf from "@turf/turf";

const wait = async (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const fetchRetry = async (url, delay, tries, fetchOptions = {}) => {
  const triesLeft = tries - 1;
  if (!triesLeft) {
    throw "Mapillary image fetch failed";
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    await wait(delay);
    return await fetchRetry(url, delay, triesLeft, fetchOptions);
  }
  return res;
};

export async function getClosestMapillaryImage({ lat, lng }) {
  const p = turf.point([lng, lat]);
  const buffer = turf.buffer(p, 0.05, { units: "kilometers" });
  const bbox = turf.bbox(buffer);

  const url = `https://graph.mapillary.com/images?fields=id,geometry&bbox=${bbox}&limit=100`;
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
    if (!closest || distance < closest.distance) {
      closest = feature;
      closest.distance = distance;
    }
  });

  return closest;
}
