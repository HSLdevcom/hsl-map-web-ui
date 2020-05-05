import React from "react";
import LineIcon from "./lineIcon";
import PropTypes from "prop-types";

const Line = ({ longName, shortName, transportType }) => (
  <div>
    <LineIcon
      transportType={transportType}
      shortName={shortName}
      lineNameFi={longName}
      iconSize="24"
    />
  </div>
);

Line.propTypes = {
  lineId: PropTypes.string.isRequired,
  longName: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  transportType: PropTypes.string,
};

export default Line;
