import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class NavBar extends React.Component {
  render() {
    return (
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
              <NavLink className="nav-item nav-link" to="#">
                {this.props.account}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  account: state.accounts[0]
})

export default connect(mapStateToProps)(NavBar)
