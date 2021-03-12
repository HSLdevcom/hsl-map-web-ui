import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import StopList from "./stopList";
import commonStyles from "../styles/common.css";
import styles from "./routeFilterItem.module.css";
import openIcon from "../icons/chevron-top.svg";
import closedIcon from "../icons/chevron-bottom.svg";

const parseRouteNumber = (routeId) =>
  // Remove 1st number, which represents the city
  // Remove all zeros from the beginning
  routeId.substring(1).replace(/^0+/, "");

class RouteFilterItem extends React.Component {
  constructor() {
    super();
    this.state = {
      stopListOpen: false,
    };
    this.toggleStopList = this.toggleStopList.bind(this);
  }

  toggleStopList() {
    this.setState({
      stopListOpen: !this.state.stopListOpen,
    });
  }

  render() {
    const inputId = `filterCheckbox_${this.props.id}`;

    const sliderBackgroundColor = this.props.isChecked ? this.props.color : "#d3d3d3";

    return (
      <div className={styles.root}>
        <div className={styles.stopListButtonWrapper}>
          <button
            className={classNames(commonStyles.noStyle, styles.stopListButton)}
            onClick={this.toggleStopList}>
            <img
              className={styles.icon}
              src={this.state.stopListOpen ? openIcon : closedIcon}
              alt=""
              height="12"
            />
            <span className={styles.textRoute}>
              {parseRouteNumber(this.props.routeID)}&nbsp;
            </span>
            <span className={styles.textDirection}>
              suunta {this.props.routeDirection}
            </span>
          </button>
        </div>
        <label className={styles.switch} htmlFor={inputId}>
          <input
            id={inputId}
            type="checkbox"
            value={`${this.props.id}`}
            checked={this.props.isChecked}
            onChange={this.props.onChange}
          />
          <div
            style={{ backgroundColor: sliderBackgroundColor }}
            className={classNames(styles.slider)}
          />
        </label>

        <StopList
          routeStops={this.props.routeStops}
          isOpen={this.state.stopListOpen}
          isFullScreen={this.props.isFullScreen}
          setMapCenter={this.props.setMapCenter}
        />
      </div>
    );
  }
}

RouteFilterItem.propTypes = {
  routeID: PropTypes.string.isRequired,
  routeDirection: PropTypes.string.isRequired,
  routeDateBegin: PropTypes.string.isRequired,
  transportType: PropTypes.string,
};

export default RouteFilterItem;
