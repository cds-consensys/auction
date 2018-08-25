import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { Provider } from 'react-redux'

import SimpleStorageContract from './truffle-contracts/SimpleStorage.json'
import Web3Load from './components/Web3Load'
import App from './components/App'
import SimpleStorage from './components/SimpleStorage'
import CreateAuction from './components/Auction'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Web3Load dappContracts={SimpleStorageContract}>
      <Router>
        <div className="App">
          <ul>
            <NavLink to="/" className="navbar pure-menu pure-menu-horizontal">
              SimpleStorage
            </NavLink>
            <NavLink
              to="/new"
              className="navbar pure-menu pure-menu-horizontal">
              New Auction
            </NavLink>
          </ul>

          <main className="container">
            <Route exact path="/" component={SimpleStorage} />
            <Route path="/new" component={CreateAuction} />
          </main>
        </div>
      </Router>
    </Web3Load>
  </Provider>,
  document.getElementById('root')
)

/* <a href="/" className="pure-menu-heading pure-menu-link">
             *   Truffle x
             * </a> */
