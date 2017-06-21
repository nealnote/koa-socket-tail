// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'app',// iife modulename
  plugins: [resolve()],
  dest: 'public/app.js' // equivalent to --output
};