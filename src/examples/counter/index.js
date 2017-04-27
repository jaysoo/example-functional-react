import ReactDOM from 'react-dom'
import CounterCmp from './CounterCmp'

export { CounterCmp }
export default (element) => {
  ReactDOM.render(
    CounterCmp.runReader().start(),
    element
  )
}
