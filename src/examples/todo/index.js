import ReactDOM from 'react-dom'
import todoApp from './todoApp'

export { todoApp }
export default (element) => {
  ReactDOM.render(
    todoApp.runReader().startWith(),
    element
  )
}
