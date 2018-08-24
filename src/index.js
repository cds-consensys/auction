import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import SimpleStorageContract from './truffle-contracts/SimpleStorage.json'
import Web3Load from './components/Web3Load'
import App from './components/App'
import CreateAuction from './components/Auction'

import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Web3Load dappContracts={SimpleStorageContract}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={App} />
            <Route path="/new" component={CreateAuction} />
          </Switch>
        </div>
      </BrowserRouter>
    </Web3Load>
  </Provider>,
  document.getElementById('root')
)
