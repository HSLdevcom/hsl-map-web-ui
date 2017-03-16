import { gql, graphql } from "react-apollo";
import Map from "./map";

const parseLineNumber = lineId =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const getTransportType = (line) => {
    if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
        return "tram";
    }
    return "bus";
};

const lineQuery = gql`
  query lineQuery($id: String!, $dateBegin: Date!, $dateEnd: Date!) {
    line: lineByLineIdAndDateBeginAndDateEnd(lineId: $id, dateBegin: $dateBegin, dateEnd: $dateEnd) {
      lineId
      nameFi
      routes {
        nodes {
          routeId
          direction
          dateBegin
          dateEnd
          routeSegments {
            nodes {
              stopNumber
              timingStopType
              duration
              stop: stopByStopId {
                stopId
                lat
                lon
                shortId
                nameFi
                nameSe
              }
            }
          }
          geometries {
            nodes {
              geometry
              dateBegin
              dateEnd
            }
          }
        }
      }
    }
  }
`;

export default graphql(lineQuery, {
    options: ({ params }) => ({ variables: params }),
    props: ({ data: { loading, line } }) => (
        loading
            ? null
            : {
                lineId: line.lineId,
                nameFi: line.nameFi,
                transportType: getTransportType(line),
                lineNumber: parseLineNumber(line.lineId),
                lineRoutes: line.routes.nodes,
            }
    ),
})(Map);
