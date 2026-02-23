import dayjs from 'dayjs';
import { FilterType } from '../constants/constants.js';

function isPointFuture(point) {
  const now = dayjs();
  return dayjs(point.startDate).isAfter(now);
}

function isPointPresent(point) {
  const now = dayjs();
  return dayjs(point.startDate).isBefore(now) && dayjs(point.endDate).isAfter(now);
}

function isPointPast(point) {
  const now = dayjs();
  return dayjs(point.endDate).isBefore(now);
}

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast)
};
