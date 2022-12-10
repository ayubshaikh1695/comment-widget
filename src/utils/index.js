import { SHORT_DAY, SHORT_MONTH } from "./constants";

export const randomId = () => {
  try {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
  } catch (err) {
    console.error(err);
    return Date.now().toString();
  }
};

export const getFormattedDateAndTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const day = SHORT_DAY[date.getUTCDay()];
    const calendarDate = date.getUTCDate();
    const month = SHORT_MONTH[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const datePart = `${day}, ${calendarDate} ${month}, ${year}`;

    let hours = date.getHours();
    const am_pm = hours >= 12 ? "PM" : "AM";
    if (hours > 12) hours = hours - 12;
    if (hours < 10) hours = `0${hours}`;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;

    const timePart = `${hours}:${minutes} ${am_pm}`;

    return `${datePart} ${timePart}`;
  } catch (err) {
    console.error(err);
    return "";
  }
};

export const sortCommentsByRecentDate = (arr) => {
  try {
    return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error(err);
    return arr;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(err);
  }
};

export const getFromLocalStorage = (key) => {
  try {
    let value = localStorage.getItem(key);
    if (value) value = JSON.parse(value);
    return value;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const isObjectEmpty = (obj) => {
  try {
    return Object.keys(obj).length === 0;
  } catch {
    return true;
  }
};
