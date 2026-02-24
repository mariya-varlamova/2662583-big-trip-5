import Observable from '../framework/observable.js';
import { FilterType } from '../constants/constants.js';

export default class FiltersModel extends Observable{
  #activeFilter = FilterType.EVERYTHING;

  get activeFilter() {
    return this.#activeFilter;
  }

  setActiveFilter(filterType) {
    if (this.#activeFilter === filterType) {
      return;
    }
    this.#activeFilter = filterType;
    this._notify();
  }
}
