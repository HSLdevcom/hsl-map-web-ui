import React from "react";
import styles from "./lineAlert.module.css";
import classnames from "classnames";
import dayjs from "dayjs";

const LineAlert = (props) => {
  const LANG = {
    FI: "fi",
    EN: "en",
    SV: "sv",
  };

  const alert = props.alert;

  const parseDate = (date) => {
    return dayjs(date).format("DD.MM.YYYY HH:MM");
  };

  const getTextWithLang = (texts, lang) => {
    try {
      const foundText = texts.find((text) => text.language === lang);
      return foundText.text;
    } catch {
      return "";
    }
  };

  return (
    <div className={classnames(styles.alertContainer, styles.outline)}>
      <h3>{getTextWithLang(alert.data.titles, LANG.FI)}</h3>
      <p className={styles.dateText}>{`${parseDate(alert.valid_from)} - ${parseDate(
        alert.valid_to
      )}`}</p>
      <p>{getTextWithLang(alert.data.descriptions, LANG.FI)}</p>
      <a className={styles.link} href={getTextWithLang(alert.data.urls, LANG.FI)}>
        {getTextWithLang(alert.data.urls, LANG.FI)}
      </a>
    </div>
  );
};

export default LineAlert;
