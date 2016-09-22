import React from "react";
import RouteList from "./routeList";
import styles from "./content.css";

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            routes: "",
            query: "",
        };
        this.getRoutes = this.getRoutes.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    componentDidMount() {
        this.getRoutes();
    }

    getRoutes() {
        fetch("http://localhost:8000/routes", {
            method: "GET",
            mode: "cors",
        })
        .then(response => response.json())
        .then((json) => {
            this.setState({ routes: JSON.stringify(json) });
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
                <RouteList
                  updateQuery={this.updateQuery}
                  query={this.state.query}
                  routes={this.state.routes}
                />
            </div>
        );
    }
}

export default Home;

