import React from "react";
import styles from "./header.css";

const Header = () => (
    <div className={styles.root}>
        <div>
            <a href="/" className={styles.logo}>
                <img
                  src="https://www.hsl.fi/sites/all/themes/custom/hsl_tyyliopas/logo.png"
                  alt="HSL / HRT"
                />
            </a>
            <h1 className={styles.sectionTitle}>Kuljettajaohjeet</h1>
        </div>
    </div>
);

export default Header;
