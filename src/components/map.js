import React from "react";
import Sidebar from "./sidebar";
import MapLeaflet from "./mapLeaflet";
import styles from "./map.css";

class Map extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedRoutes: [],
            showFilterFullScreen: false,
            isFullScreen: false,
        };
        this.addSelection = this.addSelection.bind(this);
        this.removeSelection = this.removeSelection.bind(this);
        this.mapLeafletToggleFullscreen = this.mapLeafletToggleFullscreen.bind(this);
        this.routeFilterToggleFilter = this.routeFilterToggleFilter.bind(this);
    }

    addSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.concat(route),
        });
    }

    removeSelection(route) {
        this.setState({
            selectedRoutes: this.state.selectedRoutes.filter(selected => (route !== selected)),
        });
    }

    mapLeafletToggleFullscreen() {
        this.setState({
            isFullScreen: !this.state.isFullScreen,
        });
    }

    routeFilterToggleFilter() {
        this.setState({
            showFilterFullScreen: !this.state.showFilterFullScreen,
        });
    }

    routeFilterItemToggleChecked(e) {
        if (this.state.selectedRoutes.includes(e.target.value)) {
            this.removeSelection(e.target.value);
        } else this.addSelection(e.target.value);
    }

    render() {
        return (
            <div className={styles.root}>
                <Sidebar
                  transportType={this.props.transportType}
                  lineNumber={this.props.lineNumber}
                  lineNameFi={this.props.nameFi}
                  routes={this.props.lineRoutes}
                  selectedRoutes={this.state.selectedRoutes}
                  showFilter={this.state.showFilterFullScreen}
                  isFullScreen={this.state.isFullScreen}
                  toggleChecked={this.routeFilterItemToggleChecked}
                  toggleFilter={this.routeFilterToggleFilter}
                  rootPath={this.props.route.rootPath}
                />
                <MapLeaflet
                  routes={this.props.lineRoutes}
                  selectedRoutes={this.state.selectedRoutes}
                  isFullScreen={this.state.isFullScreen}
                  toggleFullscreen={this.mapLeafletToggleFullscreen}
                />
            </div>);
    }
}

export default Map;
