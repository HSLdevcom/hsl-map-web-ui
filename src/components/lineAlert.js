import React from "react";
import styles from "./lineAlert.module.css";
import classnames from "classnames";
import dayjs from "dayjs";

const LineAlert = (props) => {
  const alert = props.alert;

  const parseDate = (date) => {
    return dayjs(date).format("DD.MM.YYYY HH:MM");
  };

  return (
    <div className={classnames(styles.alertContainer, styles.outline)}>
      <h3>{alert.data.titles[1].text}</h3>
      <p className={styles.dateText}>{`${parseDate(alert.valid_from)} - ${parseDate(
        alert.valid_to
      )}`}</p>
      <p>{alert.data.descriptions[1].text}</p>
    </div>
  );
};

export default LineAlert;
