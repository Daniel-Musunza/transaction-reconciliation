import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Health from './pages/Health'
import Property from './pages/Property'
import PrivateVC from './pages/PrivateVC'
import PrivateVTP from './pages/PrivateVTP'
import CommercialVC from './pages/CommercialVC'
import CommercialVTP from './pages/CommercialVTP'
import Header from './components/Header'
import TestForm from './pages/TestForm'
import Home from './pages/dashboard/Dashboard'

function App() {
  return (
    <>
    
      <Router>
       <Header />
        <div>
          
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element= {<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/payment' element={<TestForm />} />
            <Route path='/health' element={<Health />} />
            <Route path='/property' element={<Property />} />
            <Route path='/privatevc' element={<PrivateVC />} />
            <Route path='/privatevtp' element={<PrivateVTP />} />
            <Route path='/commercialvc' element={<CommercialVC />} />
            <Route path='/commercialvtp' element={<CommercialVTP />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
