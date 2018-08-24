import React, { Component } from 'react'
import { connect } from 'react-redux'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageFunds: 0,
      storageValue: 0,
      storageValueDoubled: 0,
      ipfsHash: '',
      buffer: null
    }

    // form is uncontrolled component
    this.handleSubmit = this.handleSubmit.bind(this)
    this.contractEvent = this.contractEvent.bind(this)

    this.inputValue = React.createRef()
    this.inputEtherValue = React.createRef()

    this.handleFileSubmit = this.handleFileSubmit.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }

  async componentDidMount() {
    try {
      this.web3 = this.props.web3
      this.accounts = this.props.accounts
      this.simpleStorageInstance = this.props.contracts[0]

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

  async setIPFSHash(hash) {
    await this.simpleStorageInstance.setIPFSHash(hash, {
      from: this.accounts[0],
      gas: 1000000
    })
  }

  async getIPFSHash() {
    let result = await this.simpleStorageInstance.getIPFSHash.call(
      this.accounts[0]
    )
    this.setState({ ipfsHash: result })
  }

  // Value in ETH converted to wei
  async setValue(value, etherValue) {
    await this.simpleStorageInstance.set(value, {
      from: this.accounts[0],
      value: this.web3.toWei(etherValue, 'ether'),
      gas: 1000000
    })
  }

  async getValue() {
    let result = await this.simpleStorageInstance.get.call(this.accounts[0])
    this.setState({ storageValue: result.c[0] })
  }

  async getDoubled() {
    let result = await this.simpleStorageInstance.getDoubled.call(
      this.accounts[0]
    )
    this.setState({ storageValueDoubled: result.c[0] })
  }

  async getFundsValue() {
    this.web3.eth.getBalance(
      this.simpleStorageInstance.address,
      (error, result) => {
        // msg.value is denoted in wei, need to convert back to ETH
        this.setState({
          storageFunds: this.web3.fromWei(result.toNumber(), 'ether')
        })
      }
    )
  }

  async handleSubmit(event) {
    event.preventDefault()

    const value = +this.inputValue.current.value
    const etherValue = +this.inputEtherValue.current.value

    console.log(`submitted value: ${value}`)
    console.log(`submitted funds: ${etherValue}`)

    await this.setValue(value, etherValue)
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

  handleFileSubmit(event) {
    event.preventDefault()
    const { ipfs } = this.props
    console.log('on submit')
    console.log(ipfs)
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      const ipfsHash = result[0].hash
      this.setState({ ipfsHash })
      this.setIPFSHash(ipfsHash)
      console.log('ipfsHash', this.state.ipfsHash)
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <h2>Smart Contract Example</h2>
              <p>The stored value is: {this.state.storageValue}</p>
              <p>The stored double is: {this.state.storageValueDoubled}</p>
              <p>The stored funds are: {this.state.storageFunds} ETH</p>
              <form onSubmit={this.handleSubmit}>
                <label>Set value: </label>
                <input type="text" ref={this.inputValue} />
                <br />
                <label>Ether to send with tx: </label>
                <input type="text" ref={this.inputEtherValue} />
                <br />
                <input type="submit" value="Submit" />
              </form>

              <hr />

              <div className="pure-u-1-1">
                <h1>Your Product Image</h1>
                <p>IPFSHash stored on blockchain: {this.state.ipfsHash}</p>
                <img
                  src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
                  alt=""
                />
                <h2>Upload Image</h2>
                <form onSubmit={this.handleFileSubmit}>
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
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

export default connect(mapStateToProps)(App)
