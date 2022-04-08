import React from "react";
import styles from "./lineSearch.module.css";
import PropTypes from "prop-types";

const LineSearch = ({ query, onChange }) => (
  <div className={styles.root}>
    <input type="text" placeholder="Hae reitti" value={query} onChange={onChange} />
  </div>
);

LineSearch.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func,
};

export default LineSearch;
