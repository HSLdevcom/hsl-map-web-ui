import React, { Component } from "react";
import { gql } from "@apollo/client";
import { inject, observer } from "mobx-react";
import qs from "qs";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import Map from "./map";
import dayjs from "dayjs";

import { parseLineNumber, parseTransportType } from "../utils/lineDataUtils";

const lineQuery = gql`
  query lineQuery($id: String!, $dateBegin: Date!, $dateEnd: Date!) {
    line: lineByLineIdAndDateBeginAndDateEnd(
      lineId: $id
      dateBegin: $dateBegin
      dateEnd: $dateEnd
    ) {
      lineId
      nameFi
      dateBegin
      dateEnd
      trunkRoute
      routes {
        nodes {
          routeId
          direction
          dateBegin
          dateEnd
          mode
          nameFi
          line {
            nodes {
              trunkRoute
              lineIdParsed
            }
          }
          routeSegments {
            nodes {
              stopIndex
              timingStopType
              duration
              line {
                nodes {
                  trunkRoute
                }
              }
              stop: stopByStopId {
                stopId
                lat
                lon
                shortId
                nameFi
                nameSe
                platform
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

const restroomQuery = gql`
  query AllRestrooms {
    allRestrooms {
      edges {
        node {
          nameFi
          addressFi
          type
          lat
          lon
          dateImported
          mode
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
    this.setState({ lines, restrooms, alerts: [], isLoading: false });
  }

  getLines = async (params) => {
    const paramsArray = params.map((line) => {
      return { id: line.lineId, dateBegin: line.dateBegin, dateEnd: line.dateEnd };
    });
    const lines = await Promise.all(
      paramsArray.map((params) =>
        this.props.apolloClient.query({
          query: lineQuery,
          variables: params,
        })
      )
    );
    return lines;
  };

  getRestrooms = async (params) => {
    const restrooms = await this.props.apolloClient.query({
      query: restroomQuery,
    });

    const restroomsData =
      restrooms.data && restrooms.data.allRestrooms
        ? restrooms.data.allRestrooms.edges
        : [];

    const restroomsInUse = restroomsData.filter(
      (restroom) => restroom.node.mode === "käytössä"
    );
    return restroomsInUse;
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

  getAlertQueryParams = (params) => {
    let query = "";
    params.map((lineData, index) => {
      return index === 0
        ? (query += `${lineData.id}[date]=${lineData.date}`)
        : (query += `&${lineData.id}[date]=${lineData.date}`);
    });
    return query;
  };

  getAlerts = async (params) => {
    this.setState({ isLoading: true });
    const linesArray = params.map((line) => {
      return { id: line.lineId, date: dayjs(new Date()).format("YYYY-MM-DDTHH:MM") };
    });
    const alertQueryParams = this.getAlertQueryParams(linesArray);
    try {
      const lineAlertsArray = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/alerts?${alertQueryParams}`
      ).then((res) => res.json());
      const alerts = await Promise.all(lineAlertsArray);
      this.setState({ isLoading: false });
      return alerts || [];
    } catch (e) {
      this.setState({ isLoading: false });
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
    const alerts = await this.getAlerts(existingParams);
    this.setState({ lines, alerts });
  };

  render() {
    if (!this.state || !this.state.lines) {
      return null;
    }

    const mapProps = this.state.lines.map((lineData) => {
      const { line } = lineData.data;
      const lineKey = `${line.lineId}${line.dateBegin}${line.dateEnd}`;
      return {
        lineId: line.lineId,
        nameFi: line.nameFi,
        lineKey: lineKey,
        transportType: parseTransportType(line),
        lineNumber: parseLineNumber(line.lineId),
        lineRoutes: sortBy(line.routes.nodes, "dateBegin"),
        trunkRoute: line.trunkRoute === "1",
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

    mapProps.removeSelectedLine = async (line) => {
      const lineKey = `${line.lineId}${line.lineNameFi}`;
      const currentLines = this.state.lines;
      const newLines = currentLines.filter((currentLine) => {
        const currentLineKey = `${currentLine.data.line.lineId}${currentLine.data.line.nameFi}`;
        return currentLineKey !== lineKey;
      });
      const mappedLineData = newLines.map((line) => {
        return { lineId: line.data.line.lineId };
      });
      const newAlerts = await this.getAlerts(mappedLineData);
      this.setUrl(newLines);
      this.setState({ lines: newLines, alerts: newAlerts });
    };

    mapProps.getAlerts = async () => {
      const mappedLineData = this.state.lines.map((line) => {
        return { lineId: line.data.line.lineId };
      });
      const newAlerts = await this.getAlerts(mappedLineData);
      this.setState({ alerts: newAlerts });
    };

    mapProps.restrooms = this.state.restrooms;
    mapProps.alerts = this.state.alerts;
    mapProps.isLoading = this.state.isLoading;
    return <Map onAddLines={this.addLines} mapProps={mapProps} />;
  }
}
export default inject("lineStore")(observer(MapContainer));
