// @flow

import {
FullMonth,
PartialMonth,
NumberMonth,
FullYear,
PartialYear,
DayOfTheWeek,
Hour,
Hour24,
Minutes,
Seconds,
PostOrAnteMeridiem,
UserText,
Day,
DayOfTheMonth,
} from './subs';
import type { Token } from './parser'
import type { TinyTimeOptions } from './index'

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
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

/**
 * Takes an integer and returns a string left padded with
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

/**
 * The compiler takes in our array of tokens returned from the parser
 * and returns the formed template. It just iterates over the tokens and
 * appends some text to the returned string depending on the type of token.
 * @param {Array<Tokens>} tokens
 * @param {Date} date
 * @param {TinyTimeOptions} options
 * @returns {String}
 */
export default function compiler(tokens: Array<Token>, date: Date, options: TinyTimeOptions): string {
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
      case NumberMonth:
        let mnth = month + 1;
        if (options.padMonth) {
          mnth = paddWithZeros(mnth);
        }
        compiled += mnth;
        break;
      case FullYear:
        compiled += year;
        break;
      case PartialYear:
        compiled += (year + '').slice(2);
        break;
      case DayOfTheWeek:
        compiled += days[date.getDay()];
        break;
      case DayOfTheMonth:
        compiled += options.padDays ? paddWithZeros(day) : day
        break;
      case Hour:
        let hour = hours === 0 || hours === 12 ? 12 : hours % 12;
        if (options.padHours) {
          hour = paddWithZeros(hour)
        }
        compiled += hour
        break;
      case Hour24:
        let hour24 = hours;
        if (options.padHours) {
          hour24 = paddWithZeros(hour24)
        }
        compiled += hour24
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
