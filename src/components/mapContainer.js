import { gql, graphql } from "react-apollo";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import Map from "./map";

const parseLineNumber = lineId =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const getTransportType = line => {
  if (
    line.lineId.substring(0, 4) >= 1001 &&
    line.lineId.substring(0, 4) <= 1010
  ) {
    return "tram";
  }
  return "bus";
};

const lineQuery = gql`
  query lineQuery($id: String!, $dateBegin: Date!, $dateEnd: Date!) {
    line: lineByLineIdAndDateBeginAndDateEnd(
      lineId: $id
      dateBegin: $dateBegin
      dateEnd: $dateEnd
    ) {
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
              stopIndex
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
      notes {
        nodes {
          noteType
          noteText
          dateEnd
        }
      }
    }
  }
`;

export default graphql(lineQuery, {
  options: ({ params }) => ({ variables: params }),
  props: ({ data: { loading, line } }) =>
    loading
      ? null
      : {
          lineId: line.lineId,
          nameFi: line.nameFi,
          transportType: getTransportType(line),
          lineNumber: parseLineNumber(line.lineId),
          lineRoutes: sortBy(line.routes.nodes, "dateBegin"),
          notes: uniq(
            line.notes.nodes
              .filter(note => note.noteType.includes("N"))
              .filter(
                note =>
                  note.dateEnd === null || new Date(note.dateEnd) > new Date()
              )
              .map(note => note.noteText)
          )
        }
})(Map);
