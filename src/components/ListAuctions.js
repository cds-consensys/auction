import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { AuctionCreated as AuctionCreatedAction } from '../actions'
import { getAuctionSummary } from '../utils'

class AuctionList extends Component {
  constructor() {
    super()
    this.state = { summaries: [] }

    this.auctionCreatedListener = this.auctionCreatedListener.bind(this)
  }

  async componentDidMount() {
    const { auctionFactory } = this.props

    try {
      auctionFactory.LogAuctionCreated(this.auctionCreatedListener)
    } catch (error) {
      console.log(error)
    }
  }

  async auctionCreatedListener(err, value) {
    console.log(JSON.stringify(value, null, 2))
    console.log('listener props: ', this.props)

    const { args } = value
    const { auction: address, beneficiary } = args
    const { defaultAccount, AuctionCreatedAction } = this.props

    const auctionContract = await this.props.auctionContract.at(address)

    const summary = await getAuctionSummary(auctionContract, defaultAccount)
    console.log(defaultAccount, beneficiary, address)
    console.log(auctionContract)
    console.log('summary', summary)
    AuctionCreatedAction(defaultAccount, beneficiary, summary)
  }

  render() {
    const { auctions } = this.props
    return (
      <React.Fragment>
        <h1 className="display-4">Your Auctions</h1>
        <AuctionTable auctions={auctions.myAuctions} />

        <h1 className="display-4">Other Auctions</h1>
        <AuctionTable auctions={auctions.otherAuctions} />
      </React.Fragment>
    )
  }
}

const AuctionTable = ({ auctions }) => (
  <table className="table table-dark table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Start</th>
        <th scope="col">End</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      {auctions.map(
        (
          { startTime, endTime, itemName, itemDescription, isMyAuction },
          index
        ) => (
          <tr key={startTime.toString() + index}>
            <th scope="row">{index}</th>
            <td>{moment(startTime).fromNow()}</td>
            <td>{moment(endTime).fromNow()}</td>
            <td>{itemName}</td>
            <td>{itemDescription}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
)

const mapStateToProps = state => {
  return {
    auctions: state.auctions,
    defaultAccount: state.accounts[0],
    auctionFactory: state.contracts.auctionFactory,
    auctionContract: state.contracts.auctionContract,
    web3: state.web3,
    web3Context: {
      from: state.accounts[0],
      gas: 1000000
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    AuctionCreatedAction: (...args) => dispatch(AuctionCreatedAction(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionList)
