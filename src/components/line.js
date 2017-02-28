import React from "react";
import { Link } from "react-router";
import LineIcon from "./lineIcon";

const Line = ({ lineId, longName, shortName, transportType }) =>
    (<div>
        <Link to={{ pathname: `/kuljettaja/${lineId}` }}>
            <LineIcon
              transportType={transportType}
              shortName={shortName}
              lineNameFi={longName}
              iconSize="24"
            />
        </Link>
    </div>);

Line.propTypes = {
    lineId: React.PropTypes.string.isRequired,
    longName: React.PropTypes.string.isRequired,
    shortName: React.PropTypes.string.isRequired,
    transportType: React.PropTypes.string,
};

export default Line;
