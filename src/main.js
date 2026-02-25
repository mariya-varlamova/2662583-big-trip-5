import TripPresenter from './presenter/trip-presenter.js';

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const presenter = new TripPresenter({
  filtersContainer,
  listContainer,
});

presenter.init();
presenter.setNewPointButton(newEventButton);
