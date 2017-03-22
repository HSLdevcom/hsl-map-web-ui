import React from "react";
import Header from "./header";
import LineListContainer from "./lineListContainer";
import styles from "./home.css";

class Home extends React.Component {
    constructor() {
        super();
        this.state = { query: "" };
        this.updateQuery = this.updateQuery.bind(this);
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
                    <LineListContainer
                      updateQuery={this.updateQuery}
                      query={this.state.query}
                      rootPath={this.props.route.rootPath}
                    />
                </div>
            </div>
        );
    }
}

export default Home;
