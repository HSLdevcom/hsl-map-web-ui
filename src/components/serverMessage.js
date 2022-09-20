import React from "react";
import dayjs from "dayjs";
import styles from "./serverMessage.module.css";
import Info from "../icons/Info";

class ServerMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const message = await this.fetchMessage();
    this.setState({ message });
  }

  fetchMessage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/UIMessages`);
      return await response.json();
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  render() {
    if (!this.state || !this.state.message || this.state.message.text === "") {
      return null;
    }
    const date = dayjs(this.state.message.created_at).format("D.M.YYYY");
    return (
      <div className={styles.bannerContainer}>
        <Info height={"14px"} color={"#999a9a"} />
        <div className={styles.bannerText}>{this.state.message.text}</div>
        <div className={styles.date}>{date}</div>
      </div>
    );
  }
}

export default ServerMessage;
