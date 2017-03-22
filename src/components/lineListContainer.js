import { gql, graphql } from "react-apollo";
import LineList from "./lineList";

const transportTypeOrder = ["tram", "bus"];

const removeTrainsFilter = line => line.lineId.substring(0, 1) !== "3";

const setTransportTypeMapper = (line) => {
    if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
        return { ...line, transportType: "tram" };
    }
    return { ...line, transportType: "bus" };
};

const parseLineNumber = lineId =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const lineNumberMapper = line => ({ ...line, lineNumber: parseLineNumber(line.lineId) });


/**
 * Sorts the line list in the following way:
 * 1. By transportation type (e.g. trams before busses)
 * 2. By line number (e.g. 14 before 18)
 * 3. By district number (e.g. 18 (1018) in Helsinki before 18 (2018) in Espoo)
 * 4. By variant (e.g. 102N before 102T)
 * @param  {Array} lines Unsorted array of lines
 * @return {Array}       Sorted array of lined
 */
const linesSorter = (a, b) => {
    if (a.transportType !== b.transportType) {
        return transportTypeOrder.indexOf(a.transportType) >
                transportTypeOrder.indexOf(b.transportType) ? 1 : -1;
    } else if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
        return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
    } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
        return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
    }
    return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
};

const AllLinesQuery = gql`
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

export default graphql(AllLinesQuery, {
    props: ({ data: { loading, allLines } }) => (
        loading
            ? null
            : {
                lines: allLines.nodes
                    .filter(node => node.routes.totalCount !== 0)
                    .filter(removeTrainsFilter)
                    .map(setTransportTypeMapper)
                    .map(lineNumberMapper)
                    .sort(linesSorter),
            }
    ),
})(LineList);
