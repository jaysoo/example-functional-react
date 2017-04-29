import ReactDOM from 'react-dom'
import counterApp from './counterApp'

export { counterApp }
export default (element) => {
  ReactDOM.render(
    counterApp.runReader().startWith(),
    element
  )
}
