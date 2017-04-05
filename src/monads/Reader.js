class _Reader {
  constructor(fn) {
    this.fn = fn
  }

  map(f) {
    return new _Reader(ctx => f(this.fn(ctx)))
  }

  contramap(f) {
    return new _Reader(ctx => this.fn(f(ctx)))
  }

  chain(g) {
    return new _Reader(ctx => g(this.fn(ctx)).fn(ctx))
  }

  ap(other) {
    return new _Reader(ctx => this.fn(ctx)(other.fn(ctx)))
  }

  runReader(ctx) {
    return this.fn(ctx)
  }
}

function Reader(fn) {
  return new _Reader(fn)
}

Reader.of = x => {
  return new _Reader(() => x)
}

Reader.ask = () => {
  return new _Reader(x => x)
}

Reader.asks = fn => {
  return new _Reader(fn)
}

export default Reader
