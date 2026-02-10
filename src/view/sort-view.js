import AbstractView from '../framework/view/abstract-view.js';
export default class SortView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    const createSortItemTemplate = (type, label, isDisabled = false, isDefault = false) => {
      const isChecked = type === this.#currentSortType;
      const disabledAttr = isDisabled ? 'disabled' : '';
      const checkedAttr = isChecked || (!this.#currentSortType && isDefault) ? 'checked' : '';
      return `
        <div class="trip-sort__item  trip-sort__item--${type}">
          <input id="sort-${type}"
                 class="trip-sort__input  visually-hidden"
                 type="radio"
                 name="trip-sort"
                 value="${type}"
                 data-sort-type="${type}"
                 ${checkedAttr}
                 ${disabledAttr}>
          <label class="trip-sort__btn"
                 for="sort-${type}"
                 data-sort-type="${type}">
            ${label}
          </label>
        </div>
      `;
    };

    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${createSortItemTemplate('day', 'Day')}
        ${createSortItemTemplate('event', 'Event', true)}
        ${createSortItemTemplate('time', 'Time')}
        ${createSortItemTemplate('price', 'Price', false, true)}
        ${createSortItemTemplate('offer', 'Offers', true)}
      </form>
    `;
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const sortElement = evt.target.closest('[data-sort-type]');
    if (!sortElement || sortElement.disabled) {
      return;
    }

    const sortType = sortElement.dataset.sortType;

    if (sortType !== this.#currentSortType) {
      this.#currentSortType = sortType;
      this.#onSortTypeChange(sortType);
    }
  };

}
