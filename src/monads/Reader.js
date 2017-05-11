const Reader = computation => ({
  map: f => Reader(ctx => f(computation(ctx))),

  contramap: f => Reader(ctx => computation(f(ctx))),

  chain: f => {
    return Reader(ctx => {
      // Get the result from original computation
      const a = computation(ctx)

      // Now get the result from the computation
      // inside the Reader `f(a)`.
      return f(a).runReader(ctx)
    })
  },

  ap: other => Reader(ctx => computation(ctx)(other.runReader(ctx))),

  runReader: ctx => computation(ctx)
})

Reader.of = x => Reader(() => x)

Reader.ask = () => {
  return Reader(x => x)
}

Reader.asks = fn => {
  return Reader(fn)
}

export default Reader
