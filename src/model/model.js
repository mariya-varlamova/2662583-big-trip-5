import { generateMockData } from '../mocks/mock-data.js';
import { UpdateType } from '../constants/constants.js';

export default class Model {
  #destinations = [];
  #routePoints = [];
  #offerGroups = {};
  #observers = [];

  constructor() {
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

  getRoutePoints() {
    return this.#routePoints;
  }

  setRoutePoints(points) {
    this.#routePoints = points;
    this.#notifyObservers();
  }

  updateRoutePoint(updatedPoint) {
    const index = this.#routePoints.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return false;
    }

    this.#routePoints[index] = updatedPoint;
    this.#notifyObservers(UpdateType.MINOR);
    return true;
  }

  addRoutePoint(newPoint) {
    this.#routePoints.push(newPoint);
    this.#notifyObservers();
    return newPoint;
  }

  deleteRoutePoint(pointId) {
    const index = this.#routePoints.findIndex((point) => point.id === pointId);

    if (index === -1) {
      return false;
    }

    this.#routePoints.splice(index, 1);
    this.#notifyObservers(UpdateType.MAJOR);
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

  addObserver(callback) {
    this.#observers.push(callback);
  }

  removeObserver(callback) {
    this.#observers = this.#observers.filter((observer) => observer !== callback);
  }

  #notifyObservers(updateType) {
    this.#observers.forEach((observer) => observer(updateType));
  }
}
