import React from 'react'
import Navbar from './components/Navbar'
import Main from './pages/Main'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Results from './pages/Results'
import Profile from './pages/Profile'
import DoctorLogin from './pages/DoctorLogin'
import Register from './pages/Register'
import Logout from './pages/Logout'
import Claim from './pages/Claim'
import { Route, Routes } from 'react-router-dom'
import AuthProvider from './AuthContext'

function App () {
  return (
    <AuthProvider>
        <div className='App'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/Services' element={<Services />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/Results' element={<Results />} />
            <Route path='/DoctorLogin' element={<DoctorLogin />} />
            <Route path='/Logout' element={<Logout />} />
            <Route path='/Register' element={<Register />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path='/claim' element={<Claim />} />
          </Routes>
        </div>
    </AuthProvider>

  )
}

export default App
