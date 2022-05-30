const path = require('path');

module.exports = {
  entry: {
    likes: './public/src/likes.js',
    reviews: './public/src/reviews.js',
    admin: './admin/src/admin.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'js'),
  },
};