import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import RoutePointView from '../view/route-point.js';
import createTripEdit from '../view/form-editing-view.js';
import createFormView from '../view/form-creation-view.js';
import createTripContent from '../view/list-view.js';
import { render } from '../render.js';

export default class Presenter {
  constructor({ filtersContainer, listContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
  }

  init() {
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.listContainer);

    const tripEventsListView = new createTripContent();
    render(tripEventsListView, this.listContainer);

    render(new createFormView(), tripEventsListView.getElement());
    render(new createTripEdit(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());

  }
}
