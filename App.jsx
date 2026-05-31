import { useState } from 'react'
import './App.css'

function App() {

  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const reset = () => {
    setCount(0)
  }

  return (
    <div className="container">

      <h1>React Counter Application</h1>

      <h2>{count}</h2>

      <button onClick={increment}>Increment</button>

      <br /><br />

      <button onClick={decrement}>Decrement</button>

      <br /><br />

      <button onClick={reset}>Reset</button>

    </div>
  )
}

export default App