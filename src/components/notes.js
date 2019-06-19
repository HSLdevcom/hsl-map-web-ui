import React from "react";
import styles from "./notes.css";

export default function Notes({ notes }) {
  return (
    <div>
      {notes &&
        notes.map((note, i) => (
          <p key={i} className={styles.note}>
            {note}
          </p>
        ))}
    </div>
  );
}
