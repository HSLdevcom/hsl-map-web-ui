import { computed, observable, decorate } from "mobx";

class ObservableLineStore {
  selectedLines = [];

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

decorate(ObservableLineStore, {
  selectedLines: observable,
  getSelectedLines: computed,
});

const observableLineStore = new ObservableLineStore();
export default observableLineStore;
