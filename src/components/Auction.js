import React, { Component } from 'react'
import { connect } from 'react-redux'

// create a new auction
// 1. name
// 2. description
// 3. ipfs
//
// 4. invoke auctionFactory

class CreateAuction extends Component {
  constructor() {
    super()
    this.state = {
      buffer: null,
      ipfsHash: ''
    }

    this.inputName = React.createRef()
    this.inputDescription = React.createRef()

    this.captureFile = this.captureFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    try {
      this.web3 = this.props.web3
      this.accounts = this.props.accounts
      this.auctionFactory = this.props.contracts[0]

      // set up events
      // https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
      //
      this.simpleStorageInstance.DataStored(this.contractEvent)
      this.simpleStorageInstance.EtherStored(this.contractEvent)
      this.simpleStorageInstance.DataStoredDoubled(this.contractEvent)

      // get values on first load
      await this.getValue()
      await this.getDoubled()
      await this.getFundsValue()
      await this.getIPFSHash()
    } catch (error) {
      console.log(error)
    }
  }

  async contractEvent(err, value) {
    // Whenver an event is emitted, then do a read to update values
    // Use this event as a trigger to invoke the get value
    console.log(JSON.stringify(value, null, 2))
    await this.getValue()
    await this.getFundsValue()
    await this.getDoubled()
    await this.getIPFSHash()
  }

  captureFile(event) {
    console.log('capture file')
    const file = event.target.files[0]
    console.log('filename', file)
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log('...handle submit')
    console.log('name', this.inputName.current.value)
    console.log('desc', this.inputDescription.current.value)
    console.log('state', this.state)
  }

  render() {
    return (
      <React.Fragment>
        <h1>Enter details to create auction</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Name:</label>
          <input type="text" ref={this.inputName} />
          <br />
          <label>Description:</label>
          <input type="text" ref={this.inputDescription} />
          <br />
          <input type="file" onChange={this.captureFile} />
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    )
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

export default connect(mapStateToProps)(CreateAuction)
