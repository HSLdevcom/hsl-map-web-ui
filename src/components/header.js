import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import styles from "./header.module.css";
import hslLogo from "../icons/hsl-logo.png";

const Header = (props) => (
  <div className={classnames(styles.root, props.isMobile ? styles.rootMobile : null)}>
    <Link to={{ pathname: "/" }}>
      <div className={props.isMobile ? styles.logoMobile : styles.logo}>
        <img src={hslLogo} alt="HSL / HRT" />
      </div>
    </Link>
    <h2
      className={classnames(
        styles.sectionTitle,
        props.isMobile ? styles.sectionTitleMobile : null
      )}>
      Kuljettajaohjeet
    </h2>
  </div>
);

export default Header;
