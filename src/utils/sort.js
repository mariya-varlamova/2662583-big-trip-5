import { SortType } from '../constants/constants.js';

export const sortPointsByDay = (pointA, pointB) => {
  const dateDifference = new Date(pointA.startDate) - new Date(pointB.startDate);
  return dateDifference;
};

export const sortPointsByTime = (pointA, pointB) => {
  const durationA = new Date(pointA.endDate) - new Date(pointA.startDate);
  const durationB = new Date(pointB.endDate) - new Date(pointB.startDate);
  return durationB - durationA;
};

export const sortPointsByPrice = (pointA, pointB) => {
  const priceDifference = pointB.price - pointA.price;
  return priceDifference;
};

export const sortPoints = (points, sortType = SortType.DAY) => {
  const sortedPoints = [...points];
  switch (sortType) {
    case SortType.TIME:
      return sortedPoints.sort(sortPointsByTime);
    case SortType.PRICE:
      return sortedPoints.sort(sortPointsByPrice);
    case SortType.DAY:
    default:
      return sortedPoints.sort(sortPointsByDay);
  }
};
