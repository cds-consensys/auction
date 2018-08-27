import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { AuctionCreated as AuctionCreatedAction } from '../actions'
import { getAuctionSummary } from '../utils'

class AuctionDetail extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      description: '',
      ipfsHash: '',
      startTime: null,
      endTime: null,
      highestBid: 0,
      cancel: false,
      beneficiaryRedeemed: false
    }

    this.auctionBidListener = this.auctionBidListener.bind(this)
    this.auctionRedemptionListener = this.auctionRedemptionListener.bind(this)
    this.web3events = []
  }

  async componentDidMount() {
    const { contract } = this.props

    try {
      this.web3events = [
        contract.LogBid(this.auctionBidListener),
        contract.LogRedemption(this.auctionRedemptionListener)
      ]
      const stateData = await this.getDetails()
      this.setState(stateData)
    } catch (error) {
      console.log(error)
    }
  }

  async auctionBidListener(err, value) {
    console.group('aucitonBidListener')
    console.log(value)
    console.groupEnd()
  }

  async auctionRedemptionListener(err, value) {
    console.group('auctionRedemptionListener')
    console.log(value)
    console.groupEnd()
  }

  async getDetails() {
    const { contract } = this.props
    const promises = [
      contract.itemName.call(),
      contract.itemDescription.call(),
      contract.ipfsImage.call(),
      contract.startTime.call(),
      contract.endTime.call(),
      contract.highestBid.call(),
      contract.cancel.call(),
      contract.beneficiaryRedeemed.call()
    ]

    const data = await Promise.all(promises)
    const contractState = 'name description ipfsHash startTime endTime highestBid cancel beneficiaryRedeemed'.split(
      ' '
    )

    return contract.State.reduce((pre, cur, dx) => {
      pre[cur] = data[dx]
      return pre
    }, {})
  }

  componentWillUnmount() {
    console.log('AuctionDetail::Stop watching web3 events')
    this.web3events.forEach(event => event.stopWatching())
    this.web3events = []
  }

  render() {
    const { auctions } = this.props
    console.log('STATE', this.state)
    console.log('PROPS', this.props)

    if (this.state.startTime === null) return <div>loading...</div>

    return (
      <React.Fragment>
        <h1>Auction Details</h1>
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
              <img
                style={{ 'max-width': '100px', height: 'auto' }}
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
                alt={`${itemDescription}`}
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionDetail)
