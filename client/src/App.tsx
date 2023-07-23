import React, { useEffect } from 'react'
import NavbarElement from './components/NavbarElement'
import BooktTable from './components/BooktTable'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const App = () => {

  return (
    <div>
      <NavbarElement />
      <BooktTable />
      <ToastContainer />
    </div>
  )
}

export default App