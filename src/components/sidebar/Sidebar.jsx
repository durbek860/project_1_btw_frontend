import React from 'react'
import "./Sidebar.css"
import { NavLink } from "react-router-dom"
import { IoGridOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { LiaWarehouseSolid } from "react-icons/lia";
import { LuFileText } from "react-icons/lu";
import { FaWarehouse } from "react-icons/fa6";
import { LuTag } from "react-icons/lu";

function Sidebar() {
  return (
    <aside>
      <div className="logo">
        <h1>Logo</h1>
      </div>
      <div className="aside_links">
        <NavLink to={'/'}><IoGridOutline /> Dashboard</NavLink>
        <NavLink to={'/employees'}><FaUsers /> Employees</NavLink>
        <NavLink to={'/warehouse'}><LiaWarehouseSolid /> Warehouse</NavLink>
        <NavLink to={'/norms'}><LuFileText /> Normatives</NavLink>
        <NavLink to={'/finished'}><FaWarehouse /> Finished Products</NavLink>
        <NavLink to={'/sales'}><LuTag /> Sales</NavLink>  
        <NavLink to={'/clients'}><FaUsers /> Clients</NavLink>
      </div>
    </aside>
  )
}

export default Sidebar