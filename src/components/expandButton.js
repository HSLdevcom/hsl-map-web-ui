import React from "react";
import classNames from "classnames";
import iconMenuOpen from "../icons/chevron-bottom.svg";
import iconMenuClosed from "../icons/chevron-top.svg";
import styles from "./expandButton.module.css";

const ExpandButton = ({ onClick, labelText, isExpanded }) => (
  <button
    className={classNames(styles.expandButton, {
      [styles.expanded]: isExpanded
    })}
    onClick={onClick}
  >
    <img src={isExpanded ? iconMenuOpen : iconMenuClosed} alt="" height="18" />
    <p>{labelText}</p>
  </button>
);

export default ExpandButton;
