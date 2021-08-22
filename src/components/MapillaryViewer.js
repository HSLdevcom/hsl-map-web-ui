import React, { useRef, useEffect, useCallback } from "react";
import * as Mapillary from "mapillary-js";
import { FiXCircle } from "react-icons/fi";
import { observer } from "mobx-react-lite";
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

    const createViewerNavigator = useCallback(
      (currentMly) => (evt) => {
        if (currentMly) {
          currentMly.setCenter([0.5, 0.675]);
        }

        onNavigation(evt);
      },
      []
    );

    const initMapillary = useCallback(() => {
      let currentMly = mly.current;

      if (currentMly) {
        return;
      }
      currentMly = new Mapillary.Viewer(
        elementId,
        "V2RqRUsxM2dPVFBMdnlhVUliTkM0ZzoxNmI5ZDZhOTc5YzQ2MzEw",
        null,
        {
          render: {
            cover: false,
          },
        }
      );

      const currentResizeListener = createResizeListener(currentMly);

      if (resizeListener.current) {
        window.removeEventListener("resize", resizeListener.current);
      }

      window.addEventListener("resize", currentResizeListener);
      resizeListener.current = currentResizeListener;

      currentMly.setFilter(["==", "organizationKey", "mstFdbqROWkgC2sNNU2tZ1"]);
      currentMly.on(Mapillary.Viewer.nodechanged, createViewerNavigator(currentMly));

      mly.current = currentMly;
    }, [mly.current, resizeListener.current]);

    const showLocation = useCallback(
      (location) => {
        if (mly.current && mly.current.isNavigable) {
          mly.current
            .moveCloseTo(location.lat, location.lng)
            .then((node) => {})
            .catch((err) => console.error(err));
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

    useEffect(() => {
      if (location) {
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
