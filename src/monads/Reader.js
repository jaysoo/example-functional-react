const Reader = fn => ({
  fn,
  
  map: f => Reader(ctx => f(fn(ctx))),

  contramap: f => Reader(ctx => fn(f(ctx))),

  chain: g => Reader(ctx => g(fn(ctx)).fn(ctx)),

  ap: other => Reader(ctx => fn(ctx)(other.fn(ctx))),

  runReader: ctx => fn(ctx)
})

Reader.of = x => {
  return Reader(() => x)
}

Reader.ask = () => {
  return Reader(x => x)
}

Reader.asks = fn => {
  return Reader(fn)
}

export default Reader
