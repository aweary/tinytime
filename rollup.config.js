import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'

export default {
  entry: 'src/index.js',
  plugins: [
    flow(),
    babel({
      presets: [
        ['es2015', { modules: false }]
      ]
    })
  ]
}