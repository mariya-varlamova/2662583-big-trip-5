import AbstractView from '../framework/view/abstract-view.js';
import { FilterEmptyMessage } from '../constants/constants.js';

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    const message = FilterEmptyMessage[this.#filterType] || FilterEmptyMessage.everything;

    return `
      <p class="trip-events__msg">${message}</p>
    `;
  }
}
