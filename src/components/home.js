import React from "react";
import Header from "./header";
import LineList from "./lineList";
import styles from "./content.css";
import { getLines } from "../utils/api";

const transportTypeOrder = ["tram", "bus"];

/**
 * Sorts the line list in the following way:
 * 1. By transportation type (e.g. trams before busses)
 * 2. By line number (e.g. 14 before 18)
 * 3. By district number (e.g. 18 (1018) in Helsinki before 18 (2018) in Espoo)
 * 4. By variant (e.g. 102N before 102T)
 * @param  {Array} lines Unsorted array of lines
 * @return {Array}       Sorted array of lined
 */
const sortLines = lines =>
    lines.sort((a, b) => {
        if (a.transportType !== b.transportType) {
            return transportTypeOrder.indexOf(a.transportType) >
                transportTypeOrder.indexOf(b.transportType) ? 1 : -1;
        } else if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
            return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
        } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
            return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
        }
        return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
    });

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            lines: [],
            query: "",
        };

        this.updateQuery = this.updateQuery.bind(this);
    }

    componentDidMount() {
        getLines().then(fetchedLines => this.setState({ lines: sortLines(fetchedLines) }));
    }

    updateQuery(input) {
        this.setState({
            query: input.target.value,
        });
    }

    render() {
        return (
            <div>
                <Header rootPath={this.props.route.rootPath}/>
                <div className={styles.root}>
                    <div className={styles.contentBox}>
                        <LineList
                          updateQuery={this.updateQuery}
                          query={this.state.query}
                          lines={this.state.lines}
                          rootPath={this.props.route.rootPath}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

