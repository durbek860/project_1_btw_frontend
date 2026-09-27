import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Transactions from './pages/transactions/Transactions'
import Employees from './pages/employees/Employees'
import Sidebar from './components/sidebar/Sidebar'
import Warehouse from './pages/warehouse/Warehouse'

function App() {
  return (
    <div className='all-container'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Transactions />} />
        <Route path='/login' element={<Login />} />
        <Route path='/employees' element={<Employees />} />
        <Route path='/warehouse' element={<Warehouse />} />
      </Routes>
    </div>
  )
}

export default App
