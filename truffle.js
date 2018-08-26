const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = process.env.MNEMONIC
const infuraEndpoint = process.INFURA_ENDPOINT

const path = require('path')
const contracts_build_directory = path.join(__dirname, 'src/truffle-contracts')

module.exports = {
  contracts_build_directory,
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infuraEndpoint)
      },
      network_id: 4
    }
  }
}
