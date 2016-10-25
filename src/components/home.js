import React from "react";
import Header from "./header";
import LineList from "./lineList";
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

