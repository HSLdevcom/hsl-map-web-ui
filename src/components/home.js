import React from "react";
import RouteList from "./routeList";
import styles from "./content.css";

const parseLineName = (lineId) => {
    let lineName = lineId.substring(1);
    lineName = lineName.replace(/^0+/, "");
    return lineName;
};

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            routes: [],
            query: "",
        };
        this.getRoutes = this.getRoutes.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    componentDidMount() {
        this.getRoutes();
    }

    getRoutes() {
        fetch("http://localhost:8000/lines", {
            method: "GET",
            mode: "cors",
        })
        .then(response => response.json())
        .then((json) => {
            const routeArray = Object.values(json);
            routeArray.forEach((value) => {
                value.lineNumber = parseLineName(value.lineId);
            });
            this.setState({ routes: routeArray });
        });
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
                      routes={this.state.routes}
                    />
                </div>
            </div>
        );
    }
}

export default Home;

