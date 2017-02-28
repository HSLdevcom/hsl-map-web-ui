import React from "react";
import { Link } from "react-router";
import styles from "./header.css";
import hslLogo from "../icons/hsl-logo.png";

const Header = () => (
    <div className={styles.root}>
        <Link to={{ pathname: "/kuljettaja" }}>
            <div className={styles.logo}>
                <img
                  src={hslLogo}
                  alt="HSL / HRT"
                />
            </div>
        </Link>
        <h2 className={styles.sectionTitle}>Kuljettajaohjeet</h2>
    </div>
);

export default Header;
