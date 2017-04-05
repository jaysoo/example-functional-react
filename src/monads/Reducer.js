const Reducer = (f) => ({
  fold(acc, x) {
    return f(acc, x)
  },

  map(g) {
    return Reducer((acc, x) => g(f(acc, x)))
  },

  contramap(g) {
    return Reducer((acc, x) => f(g(acc, x), x))
  },

  concat(other) {
    return Reducer((acc, x) => other.fold(f(acc, x), x))
  }
})

export default Reducer
