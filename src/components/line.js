import React from "react";
import { Link } from "react-router-dom";
import path from "path";
import LineIcon from "./lineIcon";
import PropTypes from "prop-types";

const Line = ({ lineId, longName, shortName, transportType, dateBegin, dateEnd }) => (
  <div>
    <Link to={{ pathname: path.join("/map", lineId, dateBegin, dateEnd) }}>
      <LineIcon
        transportType={transportType}
        shortName={shortName}
        lineNameFi={longName}
        iconSize="24"
      />
    </Link>
  </div>
);

Line.propTypes = {
  lineId: PropTypes.string.isRequired,
  longName: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  transportType: PropTypes.string,
};

export default Line;
