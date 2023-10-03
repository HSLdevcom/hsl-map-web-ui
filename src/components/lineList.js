import React, { useState, useCallback } from "react";
import { runInAction } from "mobx";
import { inject, observer } from "mobx-react";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import { useQuery, gql } from "@apollo/client";
import { get, groupBy, orderBy } from "lodash";
import Line from "./line";
import LineSearch from "./lineSearch";
import styles from "./lineList.module.css";
import {
  parseLineNumber,
  parseTransportType,
  compareLineNameOrder,
} from "../utils/lineDataUtils";

const removeTrainsFilter = (line) => line.lineId.substring(0, 1) !== "3";
const removeFerryFilter = (line) => {
  return line.routes.nodes[0].type !== "07";
};

const setTransportTypeMapper = (line) => ({
  ...line,
  transportType: parseTransportType(line),
});

const lineNumberMapper = (line) => ({
  ...line,
  lineNumber: parseLineNumber(line.lineId),
});

const allLinesQuery = gql`
  query AllLinesQuery {
    allLines {
      nodes {
        lineId
        nameFi
        dateBegin
        dateEnd
        trunkRoute
        lineIdParsed
        routes {
          totalCount
          nodes {
            mode
            type
          }
        }
      }
    }
  }
`;

const LineList = (props) => {
  const [query, setQuery] = useState("");
  const [selectedLines, setSelectedLines] = useState([]);

  const { loading, error, data } = useQuery(allLinesQuery);

  const updateQuery = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const getLineKey = (line) => `${line.lineId}${line.dateBegin}${line.dateEnd}`;
  const extractNumbers = (lineId) => lineId.match(/(\d+)/)[0];

  const sortAndsetSelectedLinestoStore = (lines) => {
    const lineObjects = lines.map((line) => {
      const lineNumber = extractNumbers(line.lineNumber);
      return { line, lineNumber };
    });
    const sortedLineObjects = lineObjects.sort((a, b) => a.lineNumber - b.lineNumber);
    const sortedLines = sortedLineObjects.map((lineObject) => lineObject.line);

    runInAction(() => {
      props.lineStore.setSelectedLines(sortedLines);
    });
  };

  const handleClick = (line) => {
    if (isSelected(line)) {
      const lineKey = getLineKey(line);
      const lines = selectedLines.filter((selectedLine) => {
        const selectedLineKey = getLineKey(selectedLine);
        return lineKey !== selectedLineKey;
      });
      setSelectedLines(lines);
      sortAndsetSelectedLinestoStore(lines);
    } else {
      const lines = selectedLines.concat(line);
      setSelectedLines(lines);
      sortAndsetSelectedLinestoStore(lines);
    }
  };

  const isSelected = (line) => {
    const lineKey = getLineKey(line);
    let isSelected = false;
    selectedLines.forEach((selectedLine) => {
      const selectedLineKey = getLineKey(selectedLine);
      if (selectedLineKey === lineKey) {
        isSelected = true;
      }
    });
    return isSelected;
  };

  const isIgnoredLine = (line) => {
    if (!props.ignoredLines) {
      return true;
    }
    const ignoredLineKeys = props.ignoredLines.map((ignoredLine) => ignoredLine.lineKey);
    const lineKey = `${line.lineId}${line.dateBegin}${line.dateEnd}`;
    return !ignoredLineKeys.includes(lineKey);
  };

  const getLineObjects = () => {
    const lines = get(data, "allLines.nodes", []).filter((line) => {
      const now = dayjs();
      const dateEnd = dayjs(line.dateEnd, "YYYY-MM-DD");
      return !dateEnd.isBefore(now);
    });
    const groupedLines = groupBy(lines, "lineId");
    const groupedLinesKeys = Object.keys(groupedLines);
    const linesFilteredByDate = groupedLinesKeys.map((key) => {
      const lineGroupSortedByDate = orderBy(
        groupedLines[key],
        (line) => dayjs(line.dateBegin, "YYYY-MM-DD"),
        ["asc"]
      );
      return lineGroupSortedByDate[0];
    });
    const queries = query.toLowerCase().split(",");
    return linesFilteredByDate
      .filter((node) => node.routes.totalCount !== 0)
      .filter(removeTrainsFilter)
      .filter(removeFerryFilter)
      .filter((line) => isIgnoredLine(line))
      .map(setTransportTypeMapper)
      .map(lineNumberMapper)
      .sort(compareLineNameOrder)
      .filter((value) => {
        if (value.lineId) {
          return (
            value.lineNumber.startsWith(query) ||
            value.nameFi.toLowerCase().includes(query.toLowerCase()) ||
            isSelected(value) ||
            queries.includes(value.lineNumber)
          );
        }
        return false;
      })
      .map((line, index) => (
        <div
          className={
            isSelected(line)
              ? styles.divContainerSelected
              : props.isMobile
              ? styles.divContainerMobile
              : styles.divContainer
          }
          key={index}
          onClick={() => handleClick(line)}>
          <Line
            key={`${line.lineId}_${line.dateBegin}_${line.dateEnd}`}
            lineId={line.lineId}
            longName={line.nameFi}
            shortName={line.lineNumber}
            transportType={line.transportType}
            dateBegin={line.dateBegin}
            dateEnd={line.dateEnd}
            trunkRoute={line.trunkRoute === "1"}
          />
        </div>
      ));
  };

  return (
    <div>
      {!props.hideTitle && (
        <div className={styles.titleContainer}>
          <h3>Linjat</h3>
        </div>
      )}

      <LineSearch query={query} onChange={updateQuery} />
      {loading && (
        <div className={`${props.frontpage ? styles.frontpageLoading : styles.loading}`}>
          <CircularProgress
            size={200}
            thickness={1}
            style={{ display: "block", margin: "auto" }}
          />
        </div>
      )}
      {data && getLineObjects()}
    </div>
  );
};

export default inject("lineStore")(observer(LineList));
