import React, { Children, Component } from 'react'
import { connect } from 'react-redux'

import { initalizeDappState } from '../actions'

class Web3Load extends Component {
  componentWillMount() {
    // thunk action creator that instantiates web3, contract, and accounts
    this.props.initalizeDappState(this.props.dappContracts)
  }

  render() {
    // The children components require web3 to function correctly and shouldn't be rendered
    // until web3 is initialized in the store
    console.group('web3loader props')
    console.log('all props ', this.props)
    console.log('this.props.web3', this.props.web3)
    console.log('this.props.accounts', this.props.accounts)
    console.log('this.props.contracts', this.props.contracts)
    console.groupEnd()

    // Todo: This is a fragile check.
    if (
      this.props.web3 &&
      this.props.accounts &&
      Object.keys(this.props.contracts).length === 3 &&
      this.props.ipfs
    ) {
      return Children.only(this.props.children)
    }

    return <div>loading dapp</div>
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    contracts: state.contracts,
    ipfs: state.ipfs,
    web3: state.web3
  }
}

export default connect(mapStateToProps, { initalizeDappState })(Web3Load)
