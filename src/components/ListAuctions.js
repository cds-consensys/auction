import React, { Component } from 'react'
import { connect } from 'react-redux'

class AuctionList extends Component {
  constructor() {
    super()

    this.state = { summaries: [] }
  }

  async componentDidMount() {
    try {
      console.log('componentDidMount')
      this.getAllAuctions()
    } catch (error) {
      console.log(error)
    }
  }

  async getAllAuctions() {
    const { auctionFactory, auctionContract, defaultAccount } = this.props

    const auctions = await auctionFactory.getAllAuctions.call()
    console.group('allAuctions query')
    console.log('auctions', auctions)
    console.groupEnd()

    const loadedAuctionsPromises = auctions.map(address =>
      auctionContract.at(address)
    )
    const loadedAuctions = await Promise.all(loadedAuctionsPromises)

    const query = async auction => {
      const startTime = await auction.auctionStartTime.call()
      const endTime = await auction.auctionEndTime.call()
      const itemName = await auction.itemName.call()
      const itemDescription = await auction.itemDescription.call()
      const ipfsHash = await auction.ipfsImage.call()
      const beneficiary = await auction.beneficiary.call()
      const isMyAuction = beneficiary === defaultAccount

      return {
        beneficiary,
        auctionInstance: auction,
        startTime: new Date(startTime.c * 1000),
        endTime: new Date(endTime.c * 1000),
        itemName,
        itemDescription,
        ipfsHash,
        isMyAuction
      }
    }

    const summaries = await Promise.all(
      loadedAuctions.map(auction => query(auction))
    )

    console.group('loadedAuction contracts')
    console.log('loadedAuctions', loadedAuctions)
    console.log('Auction summaries', summaries)
    console.groupEnd()

    summaries.sort((a, b) => a - b)
    this.setState({ summaries })
  }

  render() {
    const { summaries } = this.state

    if (summaries.length === 0) return <div>loading...</div>
    return (
      <React.Fragment>
        <div className="jumbotron">
          <h1 className="display-4">Auctions List!</h1>
          <p className="lead">Use this form to create your new auction</p>
        </div>

        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">mine</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map(
              (
                { startTime, endTime, itemName, itemDescription, isMyAuction },
                index
              ) => (
                <tr key={startTime.toString() + index}>
                  <th scope="row">{index}</th>
                  <td>{startTime.toLocaleString()}</td>
                  <td>{endTime.toLocaleString()}</td>
                  <td>{itemName}</td>
                  <td>{itemDescription}</td>
                  <td>{isMyAuction ? 'MINE' : ''}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps)(AuctionList)
