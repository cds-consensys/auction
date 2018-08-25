import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import SimpleStorageContract from './truffle-contracts/SimpleStorage.json'
import AuctionFactoryContract from './truffle-contracts/AuctionFactory.json'
import AuctionContract from './truffle-contracts/Auction.json'

import Web3Load from './components/Web3Load'
import SimpleStorage from './components/SimpleStorage'
import CreateAuction from './components/Auction'
import store from './store'
import NavBar from './components/NavBar'

const contracts = [
  SimpleStorageContract,
  AuctionFactoryContract,
  AuctionContract
]

ReactDOM.render(
  <Provider store={store}>
    <Web3Load dappContracts={contracts}>
      <Router>
        <div className="container">
          <NavBar />
          <Route exact path="/" component={SimpleStorage} />
          <Route path="/new" component={CreateAuction} />
        </div>
      </Router>
    </Web3Load>
  </Provider>,
  document.getElementById('root')
)
