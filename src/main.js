import Presenter from './presenter/presenter.js';

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');

const presenter = new Presenter({
  filtersContainer,
  listContainer,
});

presenter.init();
