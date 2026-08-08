import { Outlet,NavLink } from "react-router-dom"

import "../Styles/sidebar.css"
import bookIcon from "../assets/bookIcon.png"
import dashboardIcon from "../assets/dashboardIcon.png"
import newIcon from "../assets/newIcon.png"
import settingIcon from "../assets/settingIcon.png"

export default function SiderBar(){

    const highlight = ({isActive}) => { return isActive ? "side-items active" : "side-items" }

    return(

        <div className="layout-container">
            <nav className="sidebar">
                <NavLink to="/dashboard" className={highlight}>
                    <img src={dashboardIcon} alt="" className="side-icons" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/new" className={highlight}>
                    <img src={newIcon} alt="" className="side-icons" />
                    <span>Create New e-book</span>
                </NavLink>

                <NavLink to="/ebooks" className={highlight}>
                    <img src={bookIcon} alt="" className="side-icons" />
                    <span>My e-books</span>
                </NavLink>

                <NavLink to="/settings" className={highlight}>
                    <img src={settingIcon} alt="" className="side-icons" />
                    <span>Settings</span>
                </NavLink>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}