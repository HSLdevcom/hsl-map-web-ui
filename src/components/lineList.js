import React, { useState, useCallback } from "react";
import { inject, observer } from "mobx-react";
import CircularProgress from "material-ui/CircularProgress";
import gql from "graphql-tag";
import dayjs from "dayjs";
import { Query } from "react-apollo";
import { get, groupBy, orderBy } from "lodash";
import Line from "./line";
import LineSearch from "./lineSearch";
import styles from "./lineList.module.css";

const transportTypeOrder = ["tram", "bus"];

const removeTrainsFilter = (line) => line.lineId.substring(0, 1) !== "3";
const removeFerryFilter = (line) => {
  return line.routes.nodes[0].type !== "07";
};

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

const LineList = inject("lineStore")(
  observer((props) => {
    const [query, setQuery] = useState("");
    const [selectedLines, setSelectedLines] = useState([]);
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

      props.lineStore.setSelectedLines(sortedLines);
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
      const ignoredLineKeys = props.ignoredLines.map(
        (ignoredLine) => ignoredLine.lineKey
      );
      const lineKey = `${line.lineId}${line.dateBegin}${line.dateEnd}`;
      return !ignoredLineKeys.includes(lineKey);
    };

    return (
      <div>
        {!props.hideTitle && (
          <div className={styles.titleContainer}>
            <h3>Linjat</h3>
          </div>
        )}

        <LineSearch query={query} onChange={updateQuery} />
        <Query query={allLinesQuery}>
          {({ data }) => {
            if (!data.allLines) {
              return (
                <div
                  className={`${
                    props.frontpage ? styles.frontpageLoading : styles.loading
                  }`}>
                  <CircularProgress
                    size={200}
                    style={{ display: "block", margin: "auto" }}
                  />
                </div>
              );
            }
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
              .filter(removeFerryFilter)
              .filter((line) => isIgnoredLine(line))
              .map(setTransportTypeMapper)
              .map(lineNumberMapper)
              .sort(linesSorter)
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
                    transportType={line.routes.nodes[0].mode}
                    dateBegin={line.dateBegin}
                    dateEnd={line.dateEnd}
                    trunkRoute={line.trunkRoute === "1"}
                  />
                </div>
              ));
          }}
        </Query>
      </div>
    );
  })
);

export default LineList;
