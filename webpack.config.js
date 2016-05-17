module.exports = {
  entry: './app/client/app.js',
  output: {
    path: './public/js',
    filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  },
};
