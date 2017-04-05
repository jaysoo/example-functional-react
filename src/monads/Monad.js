const Monad = {
  do: gen => {
    let g = gen() // Will need to re-bind generator when done.
    const step = value => {
      const result = g.next(value)
      if (result.done) {
        g = gen()
        return result.value
      } else {
        return result.value.chain(step)
      }
    }
    return step()
  }
}

export default Monad
