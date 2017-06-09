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

let compiler (tokens: array token) date (options: renderOptions) => {
  let month = int_of_float (Js.Date.getMonth date);
  let year = int_of_float (Js.Date.getFullYear date);
  let hours = int_of_float (Js.Date.getHours date);
  let seconds = int_of_float (Js.Date.getSeconds date);
  let minutes = int_of_float (Js.Date.getMinutes date);
  let day = int_of_float (Js.Date.getDate date);
  let compiled = ref "";
  let index = ref 0;
  while (!index < Array.length tokens) {
    let token = Array.unsafe_get tokens !index;
    switch token.t {
    | UserText => compiled := !compiled ^ token.v
    | FullMonth => compiled := !compiled ^ Array.unsafe_get months month
    | PartialMonth =>
      compiled :=
        !compiled ^ {
          let month = Array.unsafe_get months month;
          Js.String.slice from::0 to_::3 month
        }
    | FullYear => compiled := !compiled ^ string_of_int year
    /* TODO The _to option for Js.String.slice should be optional, figure out how to do that*/
    | PartialYear => compiled := !compiled ^ Js.String.slice from::2 to_::10 (string_of_int year ^ "")
    | DayOfTheWeek =>
      compiled :=
        !compiled ^ {
          let day = int_of_float (Js.Date.getDay date);
          Array.unsafe_get days day
        }
    | Hour =>
      compiled :=
        !compiled ^ {
          let hour = hours == 0 || hours === 12 ? 12 : hours mod 12;
          if options##padHours {
            paddWithZeros hour
          } else {
            string_of_int hour
          }
        }
    | Minutes => compiled := !compiled ^ paddWithZeros minutes
    | Seconds => compiled := !compiled ^ paddWithZeros seconds
    | PostOrAnteMeridiem => compiled := !compiled ^ (hours >= 12 ? "PM" : "AM")
    | Day => compiled := !compiled ^ suffix day
    | DayOfTheMonth =>
      compiled := !compiled ^ (options##padDays ? paddWithZeros day : string_of_int day)
    | NumberMonth =>
      compiled :=
        !compiled ^ {
          let month = month + 1;
          options##padMonth ? paddWithZeros month : string_of_int month
        }
    | Hour24 =>
      compiled := !compiled ^ (options##padHours ? paddWithZeros hours : string_of_int hours)
    };
    index := !index + 1
  };
  !compiled
};