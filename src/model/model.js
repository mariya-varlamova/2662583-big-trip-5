import Observable from '../framework/observable.js';
import { generateMockData } from '../mocks/mock-data.js';
import { UpdateType } from '../constants/constants.js';

export default class Model extends Observable{
  #destinations = [];
  #routePoints = [];
  #offerGroups = {};

  constructor() {
    super();
    const mockData = generateMockData();
    this.#destinations = mockData.destinations;
    this.#routePoints = mockData.routePoints;
    this.#offerGroups = mockData.offerGroups;
  }

  get destinations() {
    return this.#destinations;
  }

  get routePoints() {
    return this.#routePoints;
  }

  get offerGroups() {
    return this.#offerGroups;
  }

  setRoutePoints(points) {
    this.#routePoints = points;
    this._notifys(UpdateType.MAJOR);
  }

  updateRoutePoint(updatedPoint) {
    const index = this.#routePoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return false;
    }

    this.#routePoints[index] = updatedPoint;
    this._notify(UpdateType.MINOR);
    return true;
  }

  addRoutePoint(newPoint) {
    const pointWithId = {
      ...newPoint,
      id: String(Date.now() + Math.random()),
      type: newPoint.type || 'flight',
      price: Number(newPoint.price) || 0,
      offers: newPoint.offers || [],
      isFavorite: false
    };
    this.#routePoints.push(pointWithId);
    this._notify(UpdateType.MAJOR);
    return pointWithId;
  }

  deleteRoutePoint(pointId) {
    const index = this.#routePoints.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return false;
    }

    this.#routePoints.splice(index, 1);
    this._notify(UpdateType.MAJOR);
    return true;
  }


  getOffersByType(type) {
    return this.#offerGroups[type] || [];
  }

  getDestinationById(id) {
    return this.#destinations.find((dest) => dest.id === id);
  }

  getEmptyRoutePoint() {
    return {
      id: 0,
      type: 'flight',
      destinationId: null,
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      offers: [],
      isFavorite: false
    };
  }

  getRoutePointById(id) {
    return this.#routePoints.find((point) => point.id === id);
  }
}
