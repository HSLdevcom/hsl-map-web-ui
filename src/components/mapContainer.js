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
    dateBegin
    dateEnd
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

const restroomQuery = `
  query AllRestrooms {
    allRestrooms {
      edges {
        node {
          nameFi
          addressFi
          type
          lat
          lon
          point
          dateImported
        }
      }
    }
  }
`;

class MapContainer extends Component {
  async componentDidMount() {
    const params = this.getQueryParamValues(this.props.location.search);
    const lines = await this.getLines(params);
    const restrooms = await this.getRestrooms();
    const alerts = await this.getAlerts(params);
    this.setState({ lines, restrooms, alerts });
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

  getRestrooms = async (params) => {
    const fetch = createApolloFetch({
      uri: process.env.REACT_APP_GRAPHQL_URL,
    });
    const restrooms = await fetch({
      query: restroomQuery,
    });
    return restrooms.data && restrooms.data.allRestrooms
      ? restrooms.data.allRestrooms.edges
      : [];
  };

  lineObject = (param, params, index) => {
    return index !== undefined
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

  getAlerts = async (params) => {
    const linesArray = params.map((line) => {
      return { id: line.lineId, dateBegin: line.dateBegin, dateEnd: line.dateEnd };
    });
    try {
      const lineAlertsArray = linesArray.map(async (line) => {
        return await fetch(`http://localhost:3001/alerts/${line.id}`).then((res) =>
          res.json()
        );
      });
      const alerts = await Promise.all(lineAlertsArray);
      console.log(alerts);
      return alerts;
    } catch (e) {
      return [];
    }
  };

  setUrl = (selectedLines) => {
    let params = "?";
    selectedLines.forEach((selectedLine, index) => {
      const and = index === selectedLines.length - 1 ? "" : "&";
      const lineId = selectedLine.data.line.lineId;
      params = `${params}${lineId}[dateBegin]=${selectedLine.data.line.dateBegin}&${lineId}[dateEnd]=${selectedLine.data.line.dateEnd}${and}`;
    });
    this.props.history.push(`/map/${params}`);
  };
  addLines = async (newLines) => {
    const existingParams = this.getQueryParamValues(this.props.location.search);
    newLines.forEach((newLine) => {
      existingParams.push({
        lineId: newLine.lineId,
        dateBegin: newLine.dateBegin,
        dateEnd: newLine.dateEnd,
      });
    });

    let params = "?";
    existingParams.forEach((param, index) => {
      const and = index === existingParams.length - 1 ? "" : "&";
      const lineId = param.lineId;
      params = `${params}${lineId}[dateBegin]=${param.dateBegin}&${lineId}[dateEnd]=${param.dateEnd}${and}`;
    });

    this.props.history.push(`/map/${params}`);

    const lines = await this.getLines(existingParams);
    this.setState({ lines });
  };

  render() {
    if (!this.state || !this.state.lines) {
      return null;
    }

    const mapProps = this.state.lines.map((lineData) => {
      const line = lineData.data.line;
      const lineKey = `${line.lineId}${line.dateBegin}${line.dateEnd}`;
      return {
        lineId: line.lineId,
        nameFi: line.nameFi,
        lineKey: lineKey,
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
    mapProps.removeSelectedLine = (line) => {
      const lineKey = `${line.lineId}${line.lineNameFi}`;
      const currentLines = this.state.lines;
      const newLines = currentLines.filter((currentLine) => {
        const currentLineKey = `${currentLine.data.line.lineId}${currentLine.data.line.nameFi}`;
        if (currentLineKey !== lineKey) return currentLine;
      });
      this.setUrl(newLines);
      this.setState({ lines: newLines });
    };
    mapProps.restrooms = this.state.restrooms;
    mapProps.alerts = this.state.alerts;
    return <Map onAddLines={this.addLines} mapProps={mapProps} />;
  }
}
export default inject("lineStore")(observer(MapContainer));
