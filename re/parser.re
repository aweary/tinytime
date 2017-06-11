open Types;

let getSubstitutionType text =>
  switch text {
  | "MMMM" => FullMonth
  | "MM" => PartialMonth
  | "Mo" => NumberMonth
  | "YYYY" => FullYear
  | "YY" => PartialYear
  | "dddd" => DayOfTheWeek
  | "DD" => DayOfTheMonth
  | "Do" => Day
  | "h" => Hour
  | "H" => Hour24
  | "mm" => Minutes
  | "ss" => Seconds
  | "a" => PostOrAnteMeridiem
  | _ => raise (Js.Exn.raiseReferenceError "foo")
  };

let pushToken tokens token => ignore (Js.Array.push token tokens);

let rec getSubstitution (characters, acc) =>
  switch characters {
  | [] => (characters, getSubstitutionType acc)
  | ["}", ...tl] => (tl, getSubstitutionType acc)
  | [char, ...tl] => getSubstitution (tl, acc ^ char)
  };

let rec buildTokenList tokens characters text =>
  switch characters {
  | [] => tokens
  | [char, ...tl] =>
    switch char {
    | "{" =>
      /* Push any accumulated user text */
      if (text != "") {
        pushToken tokens {t: UserText, v: text}
      };
      let (tl, sub) = getSubstitution (tl, "");
      pushToken tokens {t: sub, v: ""};
      buildTokenList tokens tl text
    /* Any other character is UserText */
    | _ => {
      pushToken tokens {t: UserText, v: char};
      buildTokenList tokens tl text;
    }
    };
  };

let parse template => {
  let tokens: array token = [||];
  let chars = Js.String.split "" template;
  buildTokenList tokens (Array.to_list chars) "";
};