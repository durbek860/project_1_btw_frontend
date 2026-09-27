import React from 'react'
import "./Sidebar.css"
import {Link} from "react-router-dom"
import { IoGridOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { LiaWarehouseSolid } from "react-icons/lia";

function Sidebar() {
  return (
    <aside>
        <h1>NAME TEXT</h1>
          <Link to={'/'}><IoGridOutline /> Dashboard</Link>
          <Link to={'/employees'}><FaUsers /> Employees</Link>
          <Link to={'/warehouse'}><LiaWarehouseSolid /> Warehouse</Link>
    </aside>
  )
}

export default Sidebar