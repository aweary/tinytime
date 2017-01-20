// @flow
const SECONDS = 1000;
const MINUTES = SECONDS * 60;
const HOURS = MINUTES * 60;
const DAYS = HOURS * 24;
const WEEKS = DAYS * 7;
const MONTHS = WEEKS * 4.345;

function checkAndUpdate(result, property, time) {
  if (result.difference >= time) {
    result[property] = Math.floor(result.difference / time);
     result.difference -= result[property] * time;
  }
}

/**
 * Diff takes two dates and returns an object describing the time
 * that has elapsed between them. This is not currently a supprted tinytime
 * feature, as this file isn't exported anymore. I'm not sure if it will be added.
 */
export default function diff(a: Date, b: Date) {
  let difference = a - b | 0;
  const result = {
    difference: difference,
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0, 
    months: 0,
  }
  checkAndUpdate(result, 'months', MONTHS);
  checkAndUpdate(result, 'weeks', WEEKS);
  checkAndUpdate(result, 'days', DAYS);
  checkAndUpdate(result, 'hours', HOURS);
  checkAndUpdate(result, 'minutes', MINUTES);
  checkAndUpdate(result, 'seconds', SECONDS);
  if (result.difference >= 0) {
    result.milliseconds = result.difference
  }
  return result;
}