const Reducer = f => ({
  fold: (acc, x) => f(acc, x),

  map: g => Reducer((acc, x) => g(f(acc, x))),

  contramap: g => Reducer((acc, x) => f(g(acc, x), x)),

  promap: (g, h) => Reducer((acc, x) => h(f(g(acc, x), x))),

  concat: other => Reducer((acc, x) => {
    return { ...f(acc, x), ...other.fold(acc, x) }
  })
})

export default Reducer
