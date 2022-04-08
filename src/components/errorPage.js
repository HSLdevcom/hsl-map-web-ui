import React from "react";
import classNames from "classnames";
import hslLogo from "../icons/hsl-logo.svg";
import styles from "./errorPage.module.css";

const TEXT_CONTENT = {
  fi: {
    title: "Hups, tapahtui virhe.",
    subtitle: "Pahoittelut, palvelussamme on juuri nyt ongelma.",
  },
  sv: {
    title: "Oj, ett fel har uppstått!",
    subtitle: "Just nu är det problem i vår tjänst.",
  },
  en: {
    title: "Oops! An error occurred.",
    subtitle: "Sorry, there is a problem with the service. ",
  },
};

class ErrorPage extends React.Component {
  constructor() {
    super();
    this.state = { language: "fi" };
  }

  render() {
    const LanguageButton = (props) => (
      <div
        onClick={() => {
          this.setState({ language: props.language });
        }}
        className={buttonStyle(props.language)}>
        {props.language.toUpperCase()}
      </div>
    );

    const buttonStyle = (language) =>
      classNames(styles.languageSelectButton, {
        [styles.selected]: language === this.state.language,
      });

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div
            onClick={() => {
              window.location = "/";
            }}
            className={styles.logo}>
            <img src={hslLogo} alt="HSL / HRT" />
          </div>
          <div className={styles.languageSelect}>
            <LanguageButton language={"fi"} />
            <LanguageButton language={"sv"} />
            <LanguageButton language={"en"} />
          </div>
        </div>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{TEXT_CONTENT[this.state.language].title}</div>
          <div className={styles.subtitle}>
            {TEXT_CONTENT[this.state.language].subtitle}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
