import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/aboutus' element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
