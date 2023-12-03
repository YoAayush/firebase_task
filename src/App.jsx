import { Routes, Route, Link } from 'react-router-dom'
import New from './New.jsx'
import View from './View.jsx'
import Home from './Home.jsx'
import './App.css'
import { dataCollection } from './firebase.jsx'
import { useEffect, useState } from 'react'
import { getCountFromServer } from 'firebase/firestore'

function App() {

  const [totalRecords, setTotalRecords] = useState(0)
  useEffect(() => {
    const fetchTotalRecords = async () => {
      try {
        const snapshot = await getCountFromServer(dataCollection)
        const countCollections = snapshot.data().count
        setTotalRecords(countCollections)
      } catch (error) {
        console.log("error is : ", error)
      }
    }
    fetchTotalRecords();// Call the async function inside useEffect
  }, []);  // Run the effect only once on component mount

  return (
    <>
      <div className='section-nav'>
        <nav className='navbar header'>
          <div className='btn'>
            <Link to="/Home"><button>Home</button></Link>
            {/* <button>Home</button> */}
          </div>
          <div className='btn'>
            <Link to="/New"><button>Create Record</button></Link>
          </div>
          <div className='btn'>
            <Link to="/View"><button>View Record</button></Link>
          </div>
          <div className='txt'><h3>Total Number of Records : {totalRecords}</h3></div>
        </nav>
      </div>
      <Routes>
        {/* Add a default route for the root */}
        <Route path='/' element={<View />} />
        <Route
          path='/Home'
          element={<Home />}
        ></Route>
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
    </>
  )
}

export default App
