import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateFormat } from '../constants/constants.js';

dayjs.extend(duration);

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDate() {
  const now = new Date();
  const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return new Date(pastDate.getTime() + Math.random() * (futureDate.getTime() - pastDate.getTime()));
}

export function formatDate(date, format = DateFormat.DEFAULT) {
  if (!date){
    return '';
  }

  return dayjs(date).format(format);
}

export function formatDuration(startDate, endDate) {
  if (!startDate || !endDate){
    return '';
  }
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const diffMinutes = end.diff(start, 'minute');
  const diffDays = end.diff(start, 'day');

  if (diffMinutes < 60) {
    return `${diffMinutes}M`;
  }
  if (diffDays < 1) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}H ${formattedMinutes}M`;
  }
  const days = end.diff(start, 'day');
  const remainingHours = Math.floor((diffMinutes % (24 * 60)) / 60);
  const remainingMinutes = diffMinutes % 60;

  const formattedDays = days.toString().padStart(2, '0');
  const formattedRemainingHours = remainingHours.toString().padStart(2, '0');
  const formattedRemainingMinutes = remainingMinutes.toString().padStart(2, '0');

  return `${formattedDays}D ${formattedRemainingHours}H ${formattedRemainingMinutes}M`;
}
