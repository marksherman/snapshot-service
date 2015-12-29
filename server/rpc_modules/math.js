module.exports = {
  add: function (a, b) {
    return Promise.resolve(a + b);
  },
  pow: function (a, b) {
    return Promise.resolve(Math.pow(a, b));
  }
};
