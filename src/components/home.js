import React from "react";
import Header from "./header";
import LineList from "./lineList";
import styles from "./content.css";
import { getLines } from "../utils/api";

const sortLines = lines =>
    lines.sort((a, b) => {
        if (a.lineId.substring(1, 4) === b.lineId.substring(1, 4)) {
            if (a.lineId.substring(0, 1) === b.lineId.substring(0, 1)) {
                return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
            }
            return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
        }
        return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
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
                <Header/>
                <div className={styles.root}>
                    <div className={styles.contentBox}>
                        <LineList
                          updateQuery={this.updateQuery}
                          query={this.state.query}
                          lines={this.state.lines}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

