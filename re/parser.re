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

let getSubstitution text =>
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
  | _ => [%bs.raw{| new Error("Unknown Substitution") |}];
  };

type token = {t: subsitution, v: string};

let parse template => {
  let tokens: array token = [||];
  let chars = Js.String.split "" template;
  let text = ref "";
  let position = ref 0;
  while (!position < Js.Array.length chars) {
    let c = ref (Array.unsafe_get chars !position);
    position := !position + 1;

    /**
     * A bracket indicates we're starting a subsitution. Any characters after this,
     * and before the next '}' will be considered part of the subsitution name.
     */
    if (!c == "{") {
      /* Push any usertext we've accumulated */
      if (!text != "") {
        Js.Array.push {t: UserText, v: !text} tokens;
        ()
      } else {
        ()
      };
      text := "";
      let sub = ref "";
      c := Array.unsafe_get chars !position;
      position := !position + 1;
      while (!c != "}") {
        sub := !sub ^ !c;
        c := Array.unsafe_get chars !position;
        position := !position + 1
      };
      Js.Array.push {t: getSubstitution !sub, v: ""} tokens;
      ()
    } else {
      text := !text ^ !c
    }
  };
  if (!text != "") {
    Js.Array.push {t: UserText, v: !text} tokens;
    ()
  };
  tokens
};