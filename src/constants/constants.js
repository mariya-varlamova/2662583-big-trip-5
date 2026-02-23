export const TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const CITIES = [
  'Amsterdam', 'Geneva', 'Chamonix', 'Paris', 'London',
  'Rome', 'Barcelona', 'Berlin', 'Prague', 'Vienna'
];

export const OFFER_TITLES = [
  'Add luggage', 'Switch to comfort', 'Add meal',
  'Choose seats', 'Travel by train', 'Order Uber',
  'Rent a car', 'Book tickets', 'Lunch in city'
];

export const LOREM_IPSUM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export const DateFormat = {
  DEFAULT: 'DD/MM/YY HH:mm',
  DATETIME_ATTR: 'YYYY-MM-DDTHH:mm',
  DAY_ATTR: 'YYYY-MM-DD',
  MONTH_DAY: 'MMM D',
  TIME: 'HH:mm'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
  EVENT: 'event',
  OFFER: 'offer'
};

export const DEFAULT_SORT_TYPE = SortType.DAY;

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const FilterEmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};
