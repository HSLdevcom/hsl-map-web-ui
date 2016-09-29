import React from "react";
import RouteList from "./routeList";
import styles from "./content.css";
import { getLines } from "../utils/api";

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
        getLines().then(fetchedLines => this.setState({ lines: fetchedLines }));
    }

    updateQuery(input) {
        this.setState({
            query: input.target.value,
        });
    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.contentBox}>
                    <RouteList
                      updateQuery={this.updateQuery}
                      query={this.state.query}
                      routes={this.state.lines}
                    />
                </div>
            </div>
        );
    }
}

export default Home;

