import React from "react";
import classNames from "classnames";
import iconMenuOpen from "../icons/chevron-bottom.svg";
import iconMenuClosed from "../icons/chevron-top.svg";
import styles from "./expandButton.module.css";

const ExpandButton = ({ onClick, labelText, isExpanded }) => (
  <button
    className={classNames(styles.expandButton, {
      [styles.expanded]: isExpanded,
    })}
    onClick={onClick}>
    <div className={styles.expandButtonContentContainer}>
      <div className={styles.expandButtonText}>{labelText}</div>
      <div className={styles.expandButtonImgContainer}>
        <img src={isExpanded ? iconMenuClosed : iconMenuOpen} alt="" height="18" />
      </div>
    </div>
  </button>
);

export default ExpandButton;
