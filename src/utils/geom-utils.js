export const EARTH_CIRC_M = 40075016.686;
export const Z0_RES = EARTH_CIRC_M / 256;
export const DEG_LAT_PER_M = EARTH_CIRC_M / 360;

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;

export const degLonPerM = (degLat) =>
  DEG_LAT_PER_M * Math.abs(Math.cos(degToRad(degLat)));

export const mmToM = (mm) => mm / 1000;

export const dpiToDpm = (dpi) => dpi * 39.97;

export const pixelScaleToTileScale = (pixelScale, dpi) => (pixelScale * dpi) / 72;

export const calculateZoom = (center, size, mapScale, tileScale, sizePx) =>
  Math.log2(
    (Z0_RES / ((size[1] * mapScale * tileScale) / sizePx[1])) *
      Math.abs(Math.cos(degToRad(center[1])))
  );

export const calculateSizePx = (size, dpm) => [
  Math.round(size[0] * dpm),
  Math.round(size[1] * dpm),
];

export const mapSelectionToTileScale = (mapSelection) =>
  pixelScaleToTileScale(mapSelection.pixelScale, mapSelection.dpi);

export const mapSelectionToPixelSize = (mapSelection) =>
  calculateSizePx(
    [mapSelection.width, mapSelection.height].map(mmToM),
    dpiToDpm(mapSelection.dpi)
  );

export const mapSelectionToZoom = (mapSelection) =>
  calculateZoom(
    mapSelection.center,
    [mapSelection.width, mapSelection.height].map(mmToM),
    mapSelection.mapScale,
    mapSelectionToTileScale(mapSelection),
    mapSelectionToPixelSize(mapSelection)
  );

export const mapSelectionToBbox = (mapSelection) => {
  const center = mapSelection.center;
  const size = [mapSelection.width, mapSelection.height].map(mmToM);
  const mapScale = mapSelection.mapScale;

  const sizeDeg = [
    (size[0] * mapScale) / degLonPerM(center[1]),
    (size[1] * mapScale) / DEG_LAT_PER_M,
  ];

  const bbox = [
    [center[1] - sizeDeg[1] / 2, center[0] - sizeDeg[0] / 2],
    [center[1] + sizeDeg[1] / 2, center[0] + sizeDeg[0] / 2],
  ];
  return bbox;
};

export const mapSelectionToMeterPerPixelRatio = (mapSelection) => {
  const pixelSize = mapSelectionToPixelSize(mapSelection);
  const tileScale = mapSelectionToTileScale(mapSelection);
  const widthInPixels = Math.round(pixelSize[0] / tileScale);
  const widthIRLMeters = mmToM(mapSelection.width) * mapSelection.mapScale;
  return Math.round(widthIRLMeters / widthInPixels);
};
