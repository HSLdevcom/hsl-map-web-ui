import React from "react";
import Header from "./header";
import styles from "./home.module.css";
import LineList from "./lineList";

class Home extends React.Component {
  constructor() {
    super();
    this.state = { query: "" };
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery(input) {
    this.setState({
      query: input.target.value
    });
  }

  render() {
    return (
      <div>
        <Header rootPath={process.env.REACT_APP_ROOT_PATH} />
        <div className={styles.root}>
          <LineList />
        </div>
      </div>
    );
  }
}

export default Home;
