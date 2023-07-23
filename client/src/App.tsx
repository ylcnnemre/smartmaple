import React, { useEffect } from 'react'
import { Navbar } from 'react-bootstrap'
import NavbarElement from './components/NavbarElement'
import BooktTable from './components/BooktTable'

const App = () => {

  useEffect(()=>{
    
    fetch("http://127.0.0.1:8000/api/all").then(val => val.json()).then(res => console.log("es =>",res))

  },[])

  return (
    <div>
      <NavbarElement />
      <BooktTable />
    </div>
  )
}

export default App