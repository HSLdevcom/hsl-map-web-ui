export async function getClosestMapillaryImage({ lat, lng }) {
  const latOffset = 0.001;
  const lngOffset = 0.002;
  const minx = lat - latOffset;
  const miny = lng - lngOffset;
  const maxx = lat + latOffset;
  const maxy = lng + lngOffset;
  const authResponse = await fetch(
    `https://graph.mapillary.com/images?fields=id,geometry&bbox=${miny},${minx},${maxy},${maxx}&limit=100&organization_id=227572519135262`,
    {
      method: "GET",
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${process.env.MAPILLARY_CLIENT_TOKEN}`,
      },
    }
  );
  const json = await authResponse.json();
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
