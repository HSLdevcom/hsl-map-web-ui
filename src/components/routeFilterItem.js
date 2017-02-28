import React from "react";
import classNames from "classnames";
import StopList from "./stopList";
import commonStyles from "../styles/common.css";
import styles from "./routeFilterItem.css";
import openIcon from "../icons/chevron-top.svg";
import closedIcon from "../icons/chevron-bottom.svg";

const parseRouteNumber = routeId =>
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
        const inputId = `filterCheckbox_${this.props.routeID}_${this.props.routeDirection}_${this.props.routeDateBegin}`;

        return (<div className={styles.root}>
            <div className={styles.stopListButtonWrapper}>
                <button
                  className={classNames(commonStyles.noStyle, styles.stopListButton)}
                  onClick={this.toggleStopList}
                >
                    <img
                      className={styles.icon}
                      src={this.state.stopListOpen ? openIcon : closedIcon} alt="" height="12"
                    />
                    <span className={styles.textRoute}>
                        {parseRouteNumber(this.props.routeID)}&nbsp;
                    </span>
                    <span className={styles.textDirection}>
                        suunta {this.props.routeDirection}
                    </span>
                </button>
            </div>
            <label
              className={styles.switch}
              htmlFor={inputId}
            >
                <input
                  id={inputId}
                  type="checkbox"
                  value={`${this.props.routeID}_${this.props.routeDirection}_${this.props.routeDateBegin}`}
                  checked={this.props.isChecked}
                  onChange={this.props.onChange}
                />
                <div
                  className={classNames(styles.slider,
                      { [styles.tram]: this.props.transportType === "tram",
                          [styles.bus]: this.props.transportType !== "tram",
                      })}
                />
            </label>

            <StopList
              routeStops={this.props.routeStops}
              isOpen={this.state.stopListOpen}
              isFullScreen={this.props.isFullScreen}
            />
        </div>);
    }
}

RouteFilterItem.propTypes = {
    routeID: React.PropTypes.string.isRequired,
    routeDirection: React.PropTypes.string.isRequired,
    routeDateBegin: React.PropTypes.string.isRequired,
    transportType: React.PropTypes.string,
};

export default RouteFilterItem;
