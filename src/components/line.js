import React from "react";
import { Link } from "react-router";
import LineIcon from "./lineIcon";

const Line = ({ lineId, longName, shortName, transportType }) =>
    (<div>
        <Link to={{ pathname: `/kuljettaja/${lineId}` }}>
            <LineIcon
              transportType={transportType}
              shortName={shortName}
              iconSize="27"
            />
            <span>{longName}</span>
        </Link>
    </div>);

Line.propTypes = {
    lineId: React.PropTypes.string.isRequired,
    longName: React.PropTypes.string,
    shortName: React.PropTypes.string,
};

export default Line;
