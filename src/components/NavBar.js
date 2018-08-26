import React from 'react'
import { NavLink } from 'react-router-dom'

export default () => (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li>
          <NavLink className="nav-item nav-link active" to="/new">
            Create Auction
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-item nav-link" to="/list">
            List Auctions
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-item nav-link" to="/test">
            Examples
          </NavLink>
        </li>
      </ul>
    </div>
  </nav>
)
