open Parser;

open Types;

/*Avoid pulling in pervasives*/
external string_of_int : int => string = "%identity";

let months = [|
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
|];

let days = [|"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"|];

let suffix num => {
  let stringed = string_of_int num;
  num != 11 && num mod 10 == 1 ?
    stringed ^ "st" :
    num mod 10 == 2 && num != 12 ?
      stringed ^ "nd" : num mod 10 == 3 && num != 13 ? stringed ^ "rd" : stringed ^ "th"
};

let paddWithZeros num => num < 10 ? "0" ^ string_of_int num : string_of_int num;

let buildString options date acc token => {
  let month = int_of_float (Js.Date.getMonth date);
  let year = int_of_float (Js.Date.getFullYear date);
  let hours = int_of_float (Js.Date.getHours date);
  let seconds = int_of_float (Js.Date.getSeconds date);
  let minutes = int_of_float (Js.Date.getMinutes date);
  let day = int_of_float (Js.Date.getDate date);
  switch token.t {
  | UserText => acc ^ token.v
  | FullMonth => acc ^ Array.unsafe_get months month
  | PartialMonth =>
    acc ^ {
      let month = Array.unsafe_get months month;
      Js.String.slice from::0 to_::3 month
    }
  | FullYear => acc ^ string_of_int year
  /* TODO The _to option for Js.String.slice should be optional, figure out how to do that*/
  | PartialYear => acc ^ Js.String.slice from::2 to_::10 (string_of_int year ^ "")
  | DayOfTheWeek =>
    acc ^ {
      let day = int_of_float (Js.Date.getDay date);
      Array.unsafe_get days day
    }
  | Hour =>
    acc ^ {
      let hour = hours == 0 || hours === 12 ? 12 : hours mod 12;
      if options##padHours {
        paddWithZeros hour
      } else {
        string_of_int hour
      }
    }
  | Minutes => acc ^ paddWithZeros minutes
  | Seconds => acc ^ paddWithZeros seconds
  | PostOrAnteMeridiem => acc ^ (hours >= 12 ? "PM" : "AM")
  | Day => acc ^ suffix day
  | DayOfTheMonth => acc ^ (options##padDays ? paddWithZeros day : string_of_int day)
  | NumberMonth =>
    acc ^ {
      let month = month + 1;
      options##padMonth ? paddWithZeros month : string_of_int month
    }
  | Hour24 => acc ^ (options##padHours ? paddWithZeros hours : string_of_int hours)
  }
};

let compiler (tokens: array token) date (options: renderOptions) => {
  Js.Array.reduce (buildString options date) "" tokens
};