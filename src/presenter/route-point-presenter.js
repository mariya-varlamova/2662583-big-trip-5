import RoutePointView from '../view/route-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../constants/constants.js';
export default class RoutePointPresenter {
  #model = null;
  #container = null;
  #routePoint = null;
  #routePointComponent = null;
  #editFormComponent = null;
  #escKeyDownHandler = null;
  #handleDataChange = null;
  #handleEditStart = null;
  #handleDestroy = null;
  #listItem = null;
  #isNew = false;

  constructor({container, model, onDataChange, onEditStart, onDestroy}){
    this.#container = container;
    this.#model = model;
    this.#handleDataChange = onDataChange;
    this.#handleEditStart = onEditStart;
    this.#handleDestroy = onDestroy;
  }

  init(routePoint, isNew = false){
    this.#routePoint = routePoint;
    this.#isNew = isNew;

    const destination = this.#model.getDestinationById(routePoint.destinationId);
    const offers = routePoint.offers;

    this.#routePointComponent = new RoutePointView(
      routePoint,
      destination,
      offers
    );

    this.#editFormComponent = new EditFormView(
      routePoint,
      this.#model.destinations,
      this.#model.offerGroups,
      this.#isNew
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#routePointComponent.setFavoriteClickHandler(() => {
      this.#handleFavoriteClick();
    });

    this.#editFormComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.#handleFormSubmit();
    });

    this.#editFormComponent.setFormCloseHandler(() => {
      this.#replaceFormToPoint();
    });

    this.#editFormComponent.setFormDeleteHandler(() => {
      this.#handleDeleteClick();
    });

    const listItem = document.createElement('li');
    listItem.className = 'trip-events__item';

    render(this.#routePointComponent, listItem);

    this.#container.appendChild(listItem);

    this.#listItem = listItem;

    if (this.#isNew) {
      render(this.#editFormComponent, listItem);
      this.#setEscKeyDownHandler();
    } else {
      render(this.#routePointComponent, listItem);
    }

    this.#container.appendChild(listItem);
    this.#listItem = listItem;
  }

  #handleFormSubmit() {
    const formState = this.#editFormComponent.getState();

    if (this.#isNew && !formState.destinationId) {
      return;
    }

    const updatedPoint = {
      ...this.#routePoint,
      ...formState,
      id: this.#isNew ? null : this.#routePoint.id
    };

    const actionType = this.#isNew ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
    const updateType = this.#isNew ? UpdateType.MAJOR : UpdateType.MINOR;

    this.#handleDataChange(actionType, updateType, updatedPoint);
    if (!this.#isNew) {
      this.#replaceFormToPoint();
    } else {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
    }
  }

  #handleDeleteClick() {
    if (this.#isNew) {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
    }
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      this.#routePoint
    );
  }

  #handleFavoriteClick() {
    const updatedPoint = {
      ...this.#routePoint,
      isFavorite: !this.#routePoint.isFavorite
    };

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint
    );
  }

  update(updatedPoint) {

    this.#routePoint = updatedPoint;

    const destination = this.#model.getDestinationById(updatedPoint.destinationId);
    const offers = updatedPoint.offers;

    const prevComponent = this.#routePointComponent;

    this.#routePointComponent = new RoutePointView(
      updatedPoint,
      destination,
      offers
    );

    this.#routePointComponent.setEditClickHandler(() => {
      this.#replacePointToForm();
    });

    this.#routePointComponent.setFavoriteClickHandler(() => {
      this.#handleFavoriteClick();
    });

    if (this.#editFormComponent.element?.parentElement === this.#listItem) {
      this.#editFormComponent.setPoint(updatedPoint);
    } else if (prevComponent) {
      replace(this.#routePointComponent, prevComponent);
    }
  }

  #replacePointToForm() {
    if (this.#routePointComponent.element?.parentElement !== this.#listItem) {
      return;
    }

    if (this.#handleEditStart) {
      this.#handleEditStart(this.#routePoint.id);
    }

    replace(this.#editFormComponent, this.#routePointComponent);

    this.#setEscKeyDownHandler();
  }

  #replaceFormToPoint(){

    if (!this.#editFormComponent?.element || !this.#routePointComponent?.element) {
      return;
    }

    if (this.#editFormComponent.element?.parentElement !== this.#listItem) {
      return;
    }

    if (this.#isNew) {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
      return;
    }

    replace(this.#routePointComponent, this.#editFormComponent);
    this.#removeEscKeyDownHandler();
  }

  #setEscKeyDownHandler() {
    this.#removeEscKeyDownHandler();
    this.#escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#replaceFormToPoint();
      }
    };

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #removeEscKeyDownHandler() {
    if (this.#escKeyDownHandler) {
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#escKeyDownHandler = null;
    }
  }

  resetView() {
    if (this.#isNew) {
      this.#destroy();
      if (this.#handleDestroy) {
        this.#handleDestroy();
      }
      return;
    }
    if (this.#editFormComponent && this.#editFormComponent.element.parentElement) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    this.#destroy();
  }

  #destroy() {
    if (this.#listItem && this.#listItem.parentElement) {
      this.#listItem.parentElement.removeChild(this.#listItem);
    }
    this.#removeEscKeyDownHandler();
    this.#editFormComponent = null;
    this.#routePointComponent = null;
  }
}
