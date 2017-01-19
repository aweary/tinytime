// @flow
import compiler from './compiler';
import parser from './parser'

type TinyTime = {
  render: (date: Date) => string
};

export default function tinytime(template: string): TinyTime {
  const templateAST = parser(template);
  return {
    render(date: Date) {
      return compiler(templateAST, date)
    }
  }
}