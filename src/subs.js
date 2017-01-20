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


const SubToTypeIdentifierMap: {
  [abbreviation: string]: string
} = {
  'MMMM': FullMonth,
  'MM': PartialMonth,
  'YYYY': FullYear,
  'YY': PartialYear,
  'dddd': DayOfTheWeek,
  'DD': DayOfTheMonth,
  'Do': Day,
  'h': Hour,
  'mm': Minutes,
  'ss': Seconds,
  'a': PostOrAnteMeridiem,
};

export default SubToTypeIdentifierMap;