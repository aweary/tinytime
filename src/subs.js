// @flow

/**
 * We want to represent each subs. type as minimally as possible,
 * so instead of using strings we just use characters, which lets us
 * represent 27 individual subs. using a single character each.
 */

export const UserText = 'a';
export const FullMonth = 'b';
export const PartialMonth = 'c';
export const FullYear = 'd';
export const PartialYear = 'e';
export const DayOfTheWeek = 'f';
export const Hour = 'g';
export const Minutes = 'h';
export const Seconds = 'i';
export const PostOrAnteMeridiem = 'j';
export const Day = 'k';
export const DayOfTheMonth = 'l';
export const NumberMonth = 'n';
export const Hour24 = 'm';

const SubToTypeIdentifierMap: {
  [abbreviation: string]: string
} = {
  'MMMM': FullMonth,
  'MM': PartialMonth,
  'Mo': NumberMonth,
  'YYYY': FullYear,
  'YY': PartialYear,
  'dddd': DayOfTheWeek,
  'DD': DayOfTheMonth,
  'Do': Day,
  'h': Hour,
  'H': Hour24,
  'mm': Minutes,
  'ss': Seconds,
  'a': PostOrAnteMeridiem,
};

export default SubToTypeIdentifierMap;