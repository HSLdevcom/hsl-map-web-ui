import React from "react";
import styles from "./lineAlert.module.css";
import classnames from "classnames";
import dayjs from "dayjs";

const LineAlert = (props) => {
  const alert = props.alert;

  const parseDate = (date) => {
    return dayjs(date).format("DD.MM.YYYY HH:MM");
  };

  const getTitle = (titles) => {
    try {
      const finnishTitle = titles.find((title) => title.language === "fi");
      console.log(finnishTitle);
      return finnishTitle.text;
    } catch {
      return "";
    }
  };

  const getDescription = (descriptions) => {
    try {
      const finnishDesc = descriptions.find((desc) => desc.language === "fi");
      console.log(finnishDesc);
      return finnishDesc.text;
    } catch {
      return "";
    }
  };

  return (
    <div className={classnames(styles.alertContainer, styles.outline)}>
      <h3>{getTitle(alert.data.titles)}</h3>
      <p className={styles.dateText}>{`${parseDate(alert.valid_from)} - ${parseDate(
        alert.valid_to
      )}`}</p>
      <p>{getDescription(alert.data.descriptions)}</p>
    </div>
  );
};

export default LineAlert;
