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
  let position = 0
  let text = ''
  while (position < template.length) {
    let char = template[position++];
    if (char === '{') {
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
  if (text) {
    tokens.push({
      t: UserText,
      v: text
    });
  }
  return tokens;
}