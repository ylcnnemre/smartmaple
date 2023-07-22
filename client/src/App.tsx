import React, { useEffect } from 'react'

const App = () => {

  useEffect(()=>{
    
    fetch("http://127.0.0.1:8000/api/test").then(val => val.json()).then(res => console.log("es =>",res))

  },[])

  return (
    <div>App</div>
  )
}

export default App