import React from "react";
import { Link } from "react-router";
import path from "path";
import LineIcon from "./lineIcon";

const Line = ({ lineId, longName, shortName, transportType, rootPath }) =>
    (<div>
        <Link to={{ pathname: path.join(rootPath, lineId) }}>
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
    longName: React.PropTypes.string.isRequired,
    shortName: React.PropTypes.string.isRequired,
    transportType: React.PropTypes.string,
};

export default Line;
