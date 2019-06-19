import React from "react";
import styles from "./lineSearch.css";

const LineSearch = ({ query, onChange }) => (
  <div className={styles.root}>
    <input
      type="text"
      placeholder="Hae reitti"
      value={query}
      onChange={onChange}
    />
  </div>
);

LineSearch.propTypes = {
  query: React.PropTypes.string,
  onChange: React.PropTypes.func
};

export default LineSearch;
