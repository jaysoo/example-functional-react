const Reducer = f => ({
  fold: f,

  map: g => Reducer((s, a) => g(f(s, a))),

  contramap: g => Reducer((s, a) => f(g(s, a), a)),

  promap: (g, h) => Reducer((s, a) => h(f(g(s, a), a))),

  concat: other => Reducer((s, a) => {
    return { ...f(s, a), ...other.fold(s, a) }
  })
})

export default Reducer
