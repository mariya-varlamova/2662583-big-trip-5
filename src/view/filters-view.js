import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../constants/constants.js';
export default class FiltersView extends AbstractView {

  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ currentFilter, onFilterTypeChange }) {
    super();
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    const createFilterTemplate = (filterType, label, isChecked = false) => `
      <div class="trip-filters__filter">
        <input
          id="filter-${filterType}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${filterType}"
          ${isChecked ? 'checked' : ''}
        >
        <label class="trip-filters__filter-label" for="filter-${filterType}">${label}</label>
      </div>
    `;
    return `
      <form class="trip-filters" action="#" method="get">
        ${createFilterTemplate(FilterType.EVERYTHING, 'Everything', this.#currentFilter === FilterType.EVERYTHING)}
        ${createFilterTemplate(FilterType.FUTURE, 'Future', this.#currentFilter === FilterType.FUTURE)}
        ${createFilterTemplate(FilterType.PRESENT, 'Present', this.#currentFilter === FilterType.PRESENT)}
        ${createFilterTemplate(FilterType.PAST, 'Past', this.#currentFilter === FilterType.PAST)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    `;
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
