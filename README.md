
# Tinytime ⏰
> A straightforward date and time formatter in <800b.

<a href="https://www.npmjs.org/package/tinytime">
    <img src="https://img.shields.io/npm/v/tinytime.svg?style=flat" alt="npm">
  </a> <a href="https://travis-ci.org/aweary/tinytime">
  <img src="https://travis-ci.org/aweary/tinytime.svg?branch=master" alt="travis"></a>

## API

tinytime exports a single function that returns a template object. This object has a single method, `render`, which
takes a `Date` and returns a string with the rendered data.

```js

import tinytime from 'tinytime';
const template = tinytime('The time is {h}:{mm}:{ss}{a}.');
template.render(new Date());
// The time is 11:10:20PM.
```

## Substitutions

 * `MMMM` - Full Month (September)
 * `MM` - Partial Month (Sep)
 * `Mo` - Numeric Month (9)
 * `YYYY` - Full Year (1992)
 * `YY` - Partial Year (92)
 * `dddd` - Day of the Week (Monday)
 * `DD` - Day of the Month (24)
 * `Do` - Day (24th)
 * `h` - Hours - 12h format
 * `H` - Hours - 24h format
 * `mm` - Minutes (zero padded)
 * `ss` - Seconds (zero padded)
 * `a` - AM/PM


## Efficiency

tinytime takes an approach similar to a compiler and generates an AST representing your template. This AST is generated when
you call the main `tinytime` function. This lets you efficiently re-render your template without tinytime having to parse the
template string again. That means its important that you aren't recreating the template object frequently.

Here's an example showing the right and wrong way to use tinytime with React.

Don't do this:

```jsx
function Time({ date }) {
  return (
    <div>
      {tinytime('{h}:{mm}:{ss}{a}').render(date)}
    </div>
  )
}
```

Instead, only create the template object once, and just re-render it.

```jsx
const template = tinytime('{h}:{mm}:{ss}{a}');
function Time({ date }) {
  return (
    <div>
      {template.render(date)}
    </div>
  )
}
```

### Babel Plugin

Using [`babel-plugin-transform-tinytime`](http://npm.im/babel-plugin-transform-tinytime) you can resolve this efficency concern at compile time. 
