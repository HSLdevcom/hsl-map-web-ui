import React, { Component } from "react";
import { createApolloFetch } from "apollo-fetch";
import { inject, observer } from "mobx-react";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import Map from "./map";

const parseLineNumber = (lineId) =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  lineId.substring(1).replace(/^0+/, "");

const getTransportType = (line) => {
  if (line.lineId.substring(0, 4) >= 1001 && line.lineId.substring(0, 4) <= 1010) {
    return "tram";
  }
  return "bus";
};

const lineQuery = `query lineQuery($id: String!, $dateBegin: Date!, $dateEnd: Date!) {
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
}`;

class MapContainer extends Component {
  async componentDidMount() {
    const lines = await this.getLines();
    this.setState({ lines });
  }

  queryPromise = async (params) => {
    const fetch = createApolloFetch({
      uri: process.env.REACT_APP_GRAPHQL_URL,
    });

    return await fetch({
      query: lineQuery,
      variables: params,
    });
  };

  getLines = async () => {
    const selectedLines = this.props.lineStore.getSelectedLines;
    const paramsArray = selectedLines.map((line) => {
      return { id: line.lineId, dateBegin: line.dateBegin, dateEnd: line.dateEnd };
    });

    const lines = await Promise.all(
      paramsArray.map((params) => this.queryPromise(params))
    );
    return lines;
  };

  render() {
    if (!this.state || !this.state.lines) {
      return null;
    }
    const mapProps = this.state.lines.map((lineData) => {
      const line = lineData.data.line;
      return {
        lineId: line.lineId,
        nameFi: line.nameFi,
        transportType: getTransportType(line),
        lineNumber: parseLineNumber(line.lineId),
        lineRoutes: sortBy(line.routes.nodes, "dateBegin"),
        notes: uniq(
          line.notes.nodes
            .filter((note) => note.noteType.includes("N"))
            .filter(
              (note) => note.dateEnd === null || new Date(note.dateEnd) > new Date()
            )
            .map((note) => note.noteText)
        ),
      };
    });
    return <Map mapProps={mapProps} />;
  }
}
export default inject("lineStore")(observer(MapContainer));
