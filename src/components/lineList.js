import React from "react";
import Line from "./line";
import LineSearch from "./lineSearch";

const LineList = ({ query, lines, updateQuery }) => {
    const renderLines = () =>
        lines.filter((value) => {
            if (value.lineId) {
                return value.lineNumber.startsWith(query);
            }
            return false;
        }).map(line => (
            <div>
                <Line
                  lineId={line.lineId}
                  longName={line.name_fi}
                  shortName={line.lineNumber}

                />
            </div>)
        );

    return (<div>
        <h1>Reitit</h1>
        <LineSearch
          query={query}
          onChange={updateQuery}
        />
        {lines ? renderLines() : null}
    </div>);
};

LineList.propTypes = {
    query: React.PropTypes.string,
    updateQuery: React.PropTypes.func,
};

export default LineList;
