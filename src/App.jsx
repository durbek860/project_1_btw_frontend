import React from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/login/login'
import Transactions from './pages/transactions/Transactions'
import Employees from './pages/employees/Employees'
import Sidebar from './components/sidebar/Sidebar'
import Warehouse from './pages/warehouse/Warehouse'
import Norms from './pages/norms/Norms'
import FinishedProducts from './pages/finishedProducts/FinishedProducts'
import Clients from './pages/clients/Clients'
import Sales from './pages/Sales/Sales'
import { IoIosLogOut } from "react-icons/io"
import { Popconfirm } from 'antd'

function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="all-container">

      <Sidebar />

      <div className="main_container">

        <header>
          <h1>header</h1>

          <div className="profile">
            <b>Bahromjon.A</b>

            <Popconfirm
              title="Tizimdan chiqmoqchimisiz?"
              onConfirm={logout}
            >
              <IoIosLogOut />
            </Popconfirm>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Transactions />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/norms" element={<Norms />} />
            <Route path="/finished" element={<FinishedProducts />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/sales" element={<Sales />} />
          </Routes>
        </main>

      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Login alohida */}
      <Route path="/login" element={<Login />} />

      {/* Qolgan sahifalar Layout ichida */}
      <Route path="/*" element={<Layout />} />
    </Routes>
  )
}

export default App