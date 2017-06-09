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
  | _ => [%bs.raw {| "" |}]
  };

type token = {t: subsitution, v: string};

let getNextCharacter chars position =>
  Array.unsafe_get
    chars
    {
      let oldPosition = !position;
      position := !position + 1;
      oldPosition
    };

let pushToken tokens token => ignore (Js.Array.push token tokens);

let parse template => {
  let tokens: array token = [||];
  let pushToken = pushToken tokens;
  let chars = Js.String.split "" template;
  let text = ref "";
  let position = ref 0;
  while (!position < Js.Array.length chars) {
    let c = ref (getNextCharacter chars position);
    switch !c {
    /**
     * A bracket indicates we're starting a subsitution. Any characters after this,
     * and before the next '}' will be considered part of the subsitution name.
     */
    | "{" =>
      /* Push any usertext we've accumulated */
      if (!text != "") {
        pushToken {t: UserText, v: !text}
      };
      /* Reset any user text */
      text := "";
      let sub = ref "";
      c := getNextCharacter chars position;
      while (!c != "}") {
        sub := !sub ^ !c;
        c := getNextCharacter chars position
      };
      pushToken {t: getSubstitution !sub, v: ""}
    /* Any other character should be considered user text */
    | _ => text := !text ^ !c
    }
  };
  if (!text != "") {
    pushToken {t: UserText, v: !text};
  };
  tokens
};