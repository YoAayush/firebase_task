import { Routes, Route, BrowserRouter } from 'react-router-dom'
import New from './New.jsx'
import View from './View.jsx'
import Home from './Home.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/New'
          element={<New />}
        ></Route>
        <Route
          path='/View'
          element={<View />}
        ></Route>
        <Route
          path='/New/:id'
          element={<New />}
        ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
