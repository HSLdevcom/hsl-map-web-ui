import React from "react";
import { Link } from "react-router";
import styles from "./header.css";
import hslLogo from "../icons/hsl-logo.png";

const Header = ({ rootPath }) => (
  <div className={styles.root}>
    <Link to={{ pathname: rootPath }}>
      <div className={styles.logo}>
        <img src={hslLogo} alt="HSL / HRT" />
      </div>
    </Link>
    <h2 className={styles.sectionTitle}>Kuljettajaohjeet</h2>
  </div>
);

export default Header;
