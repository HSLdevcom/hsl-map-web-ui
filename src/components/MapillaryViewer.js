import React, { useRef, useEffect, useCallback } from "react";
import { Viewer } from "mapillary-js";
import { FiXCircle } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import { getClosestMapillaryImage } from "../utils/mapUtils";
import styles from "./mapillaryViewer.module.css";

const MapillaryViewer = observer(
  ({ location, elementId, onNavigation, className, onCloseViewer }) => {
    const mly = useRef(null);
    const resizeListener = useRef(null);
    const prevLocation = useRef(null);

    const createResizeListener = useCallback(
      (currentMly) => () => {
        if (currentMly) {
          currentMly.resize();
        }
      },
      []
    );

    const initMapillary = useCallback(() => {
      let currentMly = mly.current;

      if (currentMly) {
        return;
      }
      const accessToken = process.env.MAPILLARY_CLIENT_TOKEN;
      const viewerOptions = {
        accessToken,
        container: elementId,
        render: { cover: false },
        imageKey: "2143821709111283",
      };
      currentMly = new Viewer(viewerOptions);

      const currentResizeListener = createResizeListener(currentMly);

      if (resizeListener.current) {
        window.removeEventListener("resize", resizeListener.current);
      }

      window.addEventListener("resize", currentResizeListener);
      resizeListener.current = currentResizeListener;

      currentMly.setFilter(["==", "organizationKey", "mstFdbqROWkgC2sNNU2tZ1"]);
      currentMly.on("image", (evt) => onNavigation(evt.image.lngLat));
      mly.current = currentMly;
    }, [mly.current, resizeListener.current]);

    const showLocation = useCallback(
      async (location) => {
        if (mly.current) {
          const closest = await getClosestMapillaryImage({
            lat: location.lat,
            lng: location.lng,
          });
          if (closest && closest.id) {
            mly.current
              .moveTo(closest.id)
              .then((node) => {
                onNavigation(node.lngLat);
              })
              .catch((error) => console.warn(error));
          }
        }
      },
      [mly.current, mly.current && mly.current.isNavigable]
    );

    // Clean up separately from other effects
    useEffect(() => {
      if (!mly.current) {
        initMapillary();
      }

      return () => {
        mly.current = null;
        window.removeEventListener("resize", resizeListener.current);
      };
    }, []);

    const locationEquals = (location, prevLocation) => {
      if (!prevLocation) {
        return false;
      }
      return location.lat === prevLocation.lat && location.lng === prevLocation.lng;
    };

    useEffect(() => {
      if (
        location &&
        (!prevLocation.current || !locationEquals(location, prevLocation.current))
      ) {
        showLocation(location);
        prevLocation.current = location;
      }
    }, [location, prevLocation.current, showLocation]);

    return (
      <div className={styles.viewerWrapper}>
        <div className={styles.mapillaryElement} id={elementId} />
        <div className={styles.closeButton} onClick={onCloseViewer}>
          <FiXCircle className={styles.closeButtonIcon} />
        </div>
      </div>
    );
  }
);

export default MapillaryViewer;
