import SortView from '../view/sort-view.js';
import ListView from '../view/list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { render, remove } from '../framework/render.js';
import Model from '../model/model.js';
import FiltersModel from '../model/filters-model.js';
import FiltersPresenter from './filters-presenter.js';
import RoutePointPresenter from './route-point-presenter.js';
import { DEFAULT_SORT_TYPE, UserAction, FilterType, UpdateType } from '../constants/constants.js';
import { sortPoints } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
export default class TripPresenter {
  #filtersContainer = null;
  #listContainer = null;
  #model = null;
  #filtersModel = null;
  #filtersPresenter = null;
  #routePointPresenters = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #sortComponent = null;
  #listComponent = null;
  #emptyListComponent = null;
  #newPointButton = null;
  #newPointPresenter = null;
  #isCreating = false;


  constructor({ filtersContainer, listContainer }) {
    this.#filtersContainer = filtersContainer;
    this.#listContainer = listContainer;
    this.#model = new Model();
    this.#filtersModel = new FiltersModel();

    this.#filtersPresenter = new FiltersPresenter({
      filtersContainer: this.#filtersContainer,
      filtersModel: this.#filtersModel,
      routePointsModel: this.#model
    });

    this.#handleModelEvent = this.#handleModelEvent.bind(this);
    this.#handleSortTypeChange = this.#handleSortTypeChange.bind(this);
    this.#handleNewPointClick = this.#handleNewPointClick.bind(this);
    this.#handleNewPointDestroy = this.#handleNewPointDestroy.bind(this);

    this.#model.addObserver(this.#handleModelEvent.bind(this));
    this.#filtersModel.addObserver(this.#handleModelEvent.bind(this));
  }

  init() {
    this.#filtersPresenter.init();
    this.#renderSort();
    this.#renderRoutePoints();
  }

  setNewPointButton(button) {
    this.#newPointButton = button;
    this.#newPointButton.addEventListener('click', this.#handleNewPointClick);
  }

  #handleNewPointClick = () => {
    this.#createNewPoint();
  };

  #createNewPoint() {
    if (this.#isCreating) {
      return;
    }

    this.#filtersModel.setActiveFilter(FilterType.EVERYTHING);

    if (this.#currentSortType !== DEFAULT_SORT_TYPE) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
      this.#renderSort();
    }

    this.#resetAllForms();

    this.#isCreating = true;

    if (this.#newPointButton) {
      this.#newPointButton.disabled = true;
    }

    this.#renderNewPointForm();
  }

  #renderNewPointForm() {
    const emptyPoint = this.#model.getEmptyRoutePoint();

    if (!this.#listComponent) {
      this.#renderList();
    }

    this.#resetAllForms();

    const newPointPresenter = new RoutePointPresenter({
      container: this.#listComponent.element,
      model: this.#model,
      onDataChange: this.#handlePointDataChange.bind(this),
      onEditStart: this.#handleEditStart.bind(this),
      onDestroy: this.#handleNewPointDestroy.bind(this)
    });

    newPointPresenter.init(emptyPoint, true);
    this.#newPointPresenter = newPointPresenter;
  }

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    if (this.#newPointButton) {
      this.#newPointButton.disabled = false;
    }
    this.#newPointPresenter = null;
  };

  #renderSort() {

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange.bind(this)
    });

    render(this.#sortComponent, this.#listContainer);
  }

  #renderRoutePoints() {
    const points = this.#getFilteredPoints();
    const sortedPoints = sortPoints(points, this.#currentSortType);

    if (sortedPoints.length === 0 && !this.#isCreating) {
      this.#renderEmptyList();
      return;
    }

    this.#renderList();
    this.#renderPoints(sortedPoints);
  }

  #renderEmptyList() {
    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#listComponent = null;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filtersModel.activeFilter
    });

    render(this.#emptyListComponent, this.#listContainer);
  }

  #renderList() {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }

    if (!this.#listComponent) {
      this.#listComponent = new ListView();
      render(this.#listComponent, this.#listContainer);
    }
  }

  #renderPoints(points) {
    const container = this.#listComponent.element;
    this.#clearRoutePoints();

    points.forEach((point) => {
      this.#renderRoutePoint(point, container);
    });
  }

  #renderRoutePoint(routePoint, container) {
    const pointPresenter = new RoutePointPresenter({
      container: container,
      model: this.#model,
      onDataChange: this.#handlePointDataChange.bind(this),
      onEditStart: this.#handleEditStart.bind(this)
    });

    pointPresenter.init(routePoint);

    this.#routePointPresenters.set(routePoint.id, pointPresenter);
  }

  #clearRoutePoints() {
    this.#routePointPresenters.forEach((presenter) => presenter.destroy());
    this.#routePointPresenters.clear();
  }

  #getFilteredPoints() {
    const points = this.#model.routePoints;
    const activeFilter = this.#filtersModel.activeFilter;
    return filter[activeFilter](points);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      if (this.#isCreating) {
        this.#newPointPresenter?.destroy();
        this.#handleNewPointDestroy();
      }
    }
    this.#renderRoutePoints();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#resetAllForms();

    this.#renderRoutePoints();
  };

  #handlePointDataChange(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#model.updateRoutePoint(update);
        break;
      case UserAction.ADD_POINT:
        this.#model.addRoutePoint(update);
        if (this.#isCreating) {
          this.#newPointPresenter?.destroy();
          this.#handleNewPointDestroy();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#model.deleteRoutePoint(update.id);
        break;
    }
  }

  #handleEditStart(pointId = null) {
    if (this.#isCreating) {
      this.#newPointPresenter?.destroy();
      this.#handleNewPointDestroy();
    }
    this.#resetAllForms(pointId);
  }

  #resetAllForms(exceptPointId = null) {
    this.#routePointPresenters.forEach((presenter, pointId) => {
      if (pointId !== exceptPointId){
        presenter.resetView();
      }
    });
  }
}
