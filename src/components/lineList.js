import React from "react";
import Line from "./line";
import LineSearch from "./lineSearch";

const LineList = ({ query, lines, updateQuery, rootPath }) => {
    const renderLines = () =>
        lines.filter((value) => {
            if (value.lineId) {
                return (
                  value.lineNumber.startsWith(query)
                  || value.nameFi.toLowerCase().includes(query.toLowerCase())
                );
            }
            return false;
        }).map(line => (
            <Line
              key={`${line.lineId}_${line.dateBegin}_${line.dateEnd}`}
              lineId={line.lineId}
              longName={line.nameFi}
              shortName={line.lineNumber}
              transportType={line.transportType}
              rootPath={rootPath}
              dateBegin={line.dateBegin}
              dateEnd={line.dateEnd}
            />
        ));

    return (<div>
        <h3>Reitit</h3>
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
