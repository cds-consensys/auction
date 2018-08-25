const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = process.env.MNEMONIC
const enfuraEndpoint = process.INFURA_ENDPOINT

module.exports = {
  contracts_build_directory:
    '/Users/marcus/dev/consensys/final/amal/src/truffle-contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, enfuraEndpoint)
      },
      network_id: 4
    }
  }
}
