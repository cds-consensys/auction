import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { AuctionCreated as AuctionCreatedAction } from '../actions'
import { getAuctionSummary } from '../utils'
import ResizeImage from 'react-resize-image'

class AuctionList extends Component {
  constructor() {
    super()
    this.state = { summaries: [] }

    this.auctionCreatedListener = this.auctionCreatedListener.bind(this)
    this.web3events = []
  }

  async componentDidMount() {
    const { auctionFactory } = this.props

    try {
      const event = auctionFactory.LogAuctionCreated(
        this.auctionCreatedListener
      )
      this.web3events.push[event]
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    console.log('AuctionList::Stop watching web3 events')
    this.web3events.forEach(event => event.stopWatching())
    this.web3events = []
  }

  async auctionCreatedListener(err, value) {
    const { args } = value
    const { auction: address, beneficiary } = args
    const { defaultAccount, AuctionCreatedAction, auctionContract } = this.props

    const auctionInstance = await auctionContract.at(address)

    const summary = await getAuctionSummary(auctionInstance, defaultAccount)
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
          {
            startTime,
            endTime,
            itemName,
            itemDescription,
            ipfsHash,
            isMyAuction
          },
          index
        ) => (
          <tr key={startTime.toString() + index}>
            <th scope="row">{index}</th>
            <td>{moment(startTime).fromNow()}</td>
            <td>{moment(endTime).fromNow()}</td>
            <td>
              <ResizeImage
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
                alt={`${itemDescription}`}
                options={{ width: 150 }}
              />
              {itemName}
            </td>
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
