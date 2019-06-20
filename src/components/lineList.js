import React, { useState, useCallback } from "react";
import Line from "./line";
import LineSearch from "./lineSearch";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import get from "lodash/get";

const transportTypeOrder = ["tram", "bus"];

const removeTrainsFilter = (line) => line.lineId.substring(0, 1) !== "3";
const removeFerryFilter = (line) => line.lineId.substring(0, 4) !== "1019";

const setTransportTypeMapper = (line) => {
  if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
    return { ...line, transportType: "tram" };
  }
  return { ...line, transportType: "bus" };
};

const parseLineNumber = (lineId) =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const lineNumberMapper = (line) => ({
  ...line,
  lineNumber: parseLineNumber(line.lineId),
});

const linesSorter = (a, b) => {
  if (a.transportType !== b.transportType) {
    return transportTypeOrder.indexOf(a.transportType) >
      transportTypeOrder.indexOf(b.transportType)
      ? 1
      : -1;
  } else if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
    return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
  } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
    return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
  }
  return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
};

const allLinesQuery = gql`
  query AllLinesQuery {
    allLines {
      nodes {
        lineId
        nameFi
        dateBegin
        dateEnd
        routes {
          totalCount
        }
      }
    }
  }
`;

const LineList = () => {
  const [query, setQuery] = useState("");

  const updateQuery = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div>
      <h3>Reitit</h3>
      <LineSearch query={query} onChange={updateQuery} />
      <Query query={allLinesQuery}>
        {({ data }) => {
          const lines = get(data, "allLines.nodes", []);

          return lines
            .filter((node) => node.routes.totalCount !== 0)
            .filter(removeTrainsFilter)
            .filter(removeFerryFilter)
            .map(setTransportTypeMapper)
            .map(lineNumberMapper)
            .sort(linesSorter)
            .filter((value) => {
              if (value.lineId) {
                return (
                  value.lineNumber.startsWith(query) ||
                  value.nameFi.toLowerCase().includes(query.toLowerCase())
                );
              }
              return false;
            })
            .map((line) => (
              <Line
                key={`${line.lineId}_${line.dateBegin}_${line.dateEnd}`}
                lineId={line.lineId}
                longName={line.nameFi}
                shortName={line.lineNumber}
                transportType={line.transportType}
                dateBegin={line.dateBegin}
                dateEnd={line.dateEnd}
              />
            ));
        }}
      </Query>
    </div>
  );
};

export default LineList;
