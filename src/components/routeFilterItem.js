import React from "react";
import classNames from "classnames";
import StopList from "./stopList";
import LineIcon from "./lineIcon";
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
        return (<div className={styles.root}>
            <button
              className={classNames(commonStyles.noStyle, styles.stopListButton)}
              onClick={this.toggleStopList}
            >
                <img
                  className={styles.icon}
                  src={this.state.stopListOpen ? openIcon : closedIcon} alt="" height="12"
                />
                <LineIcon
                  transportType={this.props.transportType}
                  shortName={parseRouteNumber(this.props.routeID)}
                  iconSize="18"
                  additionalStyle={{ fontSize: "20px", marginLeft: "6px", marginRight: "0px" }}
                />
                <span className={styles.textDirection}> suunta {this.props.routeDirection}</span>
            </button>
            <label
              className={styles.switch}
              htmlFor={`filterCheckbox_${this.props.routeID}_${this.props.routeDirection}_${this.props.routeDateBegin}`}
            >
                <input
                  id={`filterCheckbox_${this.props.routeID}_${this.props.routeDirection}_${this.props.routeDateBegin}`}
                  type="checkbox"
                  value={`${this.props.routeID}_${this.props.routeDirection}_${this.props.routeDateBegin}`}
                  checked={this.props.isChecked}
                  onChange={this.props.onChange}
                />
                <div className={styles.slider}/>
            </label>

            <StopList
              routeStops={this.props.routeStops}
              isOpen={this.state.stopListOpen}
            />
        </div>);
    }
}

export default RouteFilterItem;
