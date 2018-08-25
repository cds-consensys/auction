import React from 'react'
import { NavLink } from 'react-router-dom'

export default () => (
  <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a className="navbar-brand" href="#">
      Sell your stuff
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarsExampleDefault"
      aria-controls="navbarsExampleDefault"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>

    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="dropdown01"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            Auction
          </a>
          <div className="dropdown-menu" aria-labelledby="dropdown01">
            <NavLink className="dropdown-item" to="/new">
              Create Auction
            </NavLink>
            <NavLink className="dropdown-item" to="/">
              SimpleStorage Example
            </NavLink>
          </div>
        </li>
      </ul>
    </div>
  </nav>
)
