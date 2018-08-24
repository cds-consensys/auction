import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import SimpleStorageContract from './truffle-contracts/SimpleStorage.json'
import Web3Load from './components/Web3Load'
import App from './components/App'
import CreateAuction from './components/Auction'

import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Web3Load dappContracts={SimpleStorageContract}>
      <Router>
        <div>
          <Route exact path="/" component={App} />
          <Route path="/new" component={CreateAuction} />
        </div>
      </Router>
    </Web3Load>
  </Provider>,
  document.getElementById('root')
)
