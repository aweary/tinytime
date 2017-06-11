type subsitution =
  | UserText
  | FullMonth
  | PartialMonth
  | FullYear
  | PartialYear
  | DayOfTheWeek
  | Hour
  | Minutes
  | Seconds
  | PostOrAnteMeridiem
  | Day
  | DayOfTheMonth
  | NumberMonth
  | Hour24;

type token = {t: subsitution, v: string};

type renderOptions = Js.t {. padMonth : bool, padDays : bool, padHours : bool};