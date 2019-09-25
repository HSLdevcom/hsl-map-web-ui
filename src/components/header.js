import React from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import hslLogo from "../icons/hsl-logo.png";

const Header = () => (
  <div className={styles.root}>
    <Link to={{ pathname: "/"}}>
      <div className={styles.logo}>
        <img src={hslLogo} alt="HSL / HRT" />
      </div>
    </Link>
    <h2 className={styles.sectionTitle}>Kuljettajaohjeet</h2>
  </div>
);

export default Header;
