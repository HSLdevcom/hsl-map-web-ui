import React, { Component } from "react";
import { createApolloFetch } from "apollo-fetch";
import { inject, observer } from "mobx-react";
import qs from "qs";
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
    const params = this.getQueryParamValues(this.props.location.search);
    const lines = await this.getLines(params);
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

  getLines = async (params) => {
    const paramsArray = params.map((line) => {
      return { id: line.lineId, dateBegin: line.dateBegin, dateEnd: line.dateEnd };
    });
    const lines = await Promise.all(
      paramsArray.map((params) => this.queryPromise(params))
    );
    return lines;
  };

  lineObject = (param, params, index) => {
    return index
      ? {
          lineId: param,
          dateBegin: params[param].dateBegin[index],
          dateEnd: params[param].dateEnd[index],
        }
      : {
          lineId: param,
          dateBegin: params[param].dateBegin,
          dateEnd: params[param].dateEnd,
        };
  };

  getQueryParamValues = (url) => {
    const params = qs.parse(url, {
      ignoreQueryPrefix: true,
    });
    const lines = [];
    Object.keys(params).forEach((param) => {
      if (Array.isArray(params[param].dateBegin)) {
        for (let i = 0; i < params[param].dateBegin.length; i++) {
          lines.push(this.lineObject(param, params, i));
        }
      } else {
        lines.push(this.lineObject(param, params));
      }
    });
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
