import { FilterType } from '../constants/constants.js';

export default class FiltersModel {
  #activeFilter = FilterType.EVERYTHING;
  #observers = [];

  get activeFilter() {
    return this.#activeFilter;
  }

  setActiveFilter(filterType) {
    if (this.#activeFilter === filterType) {
      return;
    }
    this.#activeFilter = filterType;
    this.#notifyObservers();
  }

  addObserver(callback) {
    this.#observers.push(callback);
  }

  removeObserver(callback) {
    this.#observers = this.#observers.filter((observer) => observer !== callback);
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
