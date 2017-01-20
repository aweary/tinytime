// @flow

import {
FullMonth,
PartialMonth,
FullYear,
PartialYear,
DayOfTheWeek,
Hour,
Minutes,
Seconds,
PostOrAnteMeridiem,
UserText,
Day,
DayOfTheMonth,
} from './subs';
import type { Token } from './parser'

/**
 * These types help ensure we don't misspell them anywhere. They will be
 * removed during build.
 */
type Days = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
type Month =  "January" | "Febuary" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December" 

const months: Array<Month> = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const days: Array<Days> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

/**
 * Taks an integer and returns a string left padded with 
 * a zero to the left. Used to display minutes and hours (1:01:00PM);
 */
function paddWithZeros(int: number) : string {
  return int < 10 ? '0' + int : '' + int;
}

/**
 * Adds suffix to day, so 16 becomes 16th.
 */
function suffix(int: number): string {
    return (int % 10) == 1 && int != 11
      ? int  + "st"
      : (int % 10) == 2 && int != 12
      ? int + "nd"
      : (int % 10) == 3 && int != 13
      ? int + "rd"
      : int + "th";
}

export default function compiler(tokens: Array<Token>, date: Date): string {
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const day = date.getDate();
  let compiled = '';
  let index = 0;
  while (index < tokens.length) {
    const token = tokens[index];
    switch (token.t) {
      case UserText:
      // $FlowFixMe flow doesn't know that v is always populated on UserText
        compiled += token.v;
        break;
      case Day:
        compiled += suffix(day);
        break;
      case PartialMonth:
        compiled += months[month].slice(0, 3);
        break;
      case FullMonth:
        compiled += months[month];
        break;
      case FullYear:
        compiled += year;
        break;
      case PartialYear:
        compiled += (year + '').slice(2);
        break;
      case DayOfTheWeek:
        compiled += days[date.getDay() - 1];
        break;
      case DayOfTheMonth:
        compiled += day
        break;
      case Hour:
        compiled += hours === 0 ? 12 : hours % 12;
        break;
      case Minutes:
        compiled += paddWithZeros(minutes);
        break;
      case Seconds:
        compiled += paddWithZeros(seconds);
        break;
      case PostOrAnteMeridiem:
        compiled += hours >= 12 ? 'PM' : 'AM';
        break;
    }
    index++;
  }
  return compiled;
}