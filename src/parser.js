// @flow
import SubToTypeIdentifierMap, { UserText } from './subs'

/**
 * t is type and v is value. Minified property
 * names are being used because the current minification
 * step does not mangle property names, and we want to
 * reduce bundle size as much as possible.
 */
export type Token = {
  t: string,
  v?: string
};

/**
 * Rather than using a bunch of potentially confusing regular
 * expressions to match patterns in templates, we use a simple
 * parser, taking the aproach of a compiler. This is equivalent
 * to a lexer as it returns a stream of tokens. Since there is
 * no additional analysis required for semantics we just call
 * it a parser.
 * 
 * It will return an array of tokens, each corresponding to either
 * UserText (just text we want to render) or any number of the
 * subsitution types stored in SubToTypeIdentifierMap.
 * 
 */
export default function parser(template: string): Array<Token> {
  const tokens: Array<Token> = []
  /**
   * We iterate through each character in the template string, and track
   * the index of the character we're processing with `position`. We start
   * at 0, the first character.
   */
  let position = 0
  /**
   * `text` is used to accumulate what we call "UserText", or simply text that
   * is not a subsitution. For example, in the template:
   *  
   *  "The day is {day}."
   * 
   * There are two instances of `UserText`, "The day is " and ".", which is the text
   * befor eand after the subsitution. With this template our tokens would look something like:
   * 
   * [
   *  { type: UserText, value: "The day is "},
   *  { type : DaySub },
   *  { type: UserText, value: "." }
   * ]
   * 
   */
  let text = ''
  while (position < template.length) {
    let char = template[position++];
    /**
     * A bracket indicates we're starting a subsitution. Any characters after this,
     * and before the next '}' will be considered part of the subsitution name.
     */
    if (char === '{') {
      // Push any `UserText` we've accumulated and reset the `text` variable.
      if (text) {
        tokens.push({
          t: UserText,
          v: text
        });
      }
      text = ''
      let sub = '';
      char = template[position++];
      while (char !== '}') {
        sub += char;
        char = template[position++];
      }
      tokens.push({
        t: SubToTypeIdentifierMap[sub]
      })
    }
    // Anything not inside brackets is just plain text.
    else {
      text += char
    }
  }
  /**
   * We might have some text after we're done iterating through the template if
   * the template ends with some `UserText`.
   */
  if (text) {
    tokens.push({
      t: UserText,
      v: text
    });
  }
  return tokens;
}