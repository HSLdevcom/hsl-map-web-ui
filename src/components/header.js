import React from "react";
import { Link } from "react-router";
import styles from "./header.css";

const Header = ({ rootPath }) => (
    <div className={styles.root}>
        <Link to={{ pathname: rootPath }}>
            <div className={styles.logo}>
                <img
                  src="https://www.hsl.fi/sites/all/themes/custom/hsl_tyyliopas/logo.png"
                  alt="HSL / HRT"
                />
            </div>
        </Link>
        <h1 className={styles.sectionTitle}>Kuljettajaohjeet</h1>
    </div>
);

export default Header;
