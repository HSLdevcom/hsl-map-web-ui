import { action, computed, observable, makeObservable } from "mobx";

class ObservableLineStore {
  selectedLines = [];

  constructor(selectedLines) {
    makeObservable(this, {
      selectedLines: observable,
      getSelectedLines: computed,
      clearSelectedLines: action,
    });
  }

  get getSelectedLines() {
    return this.selectedLines;
  }

  setSelectedLines(lines) {
    this.selectedLines = lines;
  }

  clearSelectedLines() {
    this.selectedLines = [];
  }
}

const observableLineStore = new ObservableLineStore();
export default observableLineStore;
