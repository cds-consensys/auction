# Auction Smart Contract

This truffle project explores how to use the Ethereum platform and the
Interplanetary File System (IPFS) to implement an open auction. Storing data on
Ethereum is expensive, so the approach is reference off chain data on IPFS. This
works well as the hashes are manageable and inexpensive to store.


## User stories

The smart contract is set up to allow the following stories.
  * As a seller I want to list something for auction. I will give it a
    name, a description, an image and a time limit.
  * As a seller I want to list my Auctions.
  * As a seller I want to cancel one of my auctions.
  * As a seller I want to redeem the winning bid for my item.
  * As a buyer, I want to see a list of Auctions and bid on an item.
  * As a buyer, I want to be refunded if I didn't have the winning bid.
  * As an Administrator, I want to stop users from creating auctions.
  * As an Administrator, I can re-enable users to create auctions.

## Getting started

This project uses node, specifically 9.11.2. I use
[nvm](https://github.com/creationix/nvm) to manage node versions
and this repository comes with `.nvmrc`. If you have `nvm` installed,
run `nvm use` to activate the correct version.

1. Install Truffle and Ganache CLI globally. (or the GUI version of Ganache, alternatively)
    ```sh
    npm install -g truffle@4.1.14
    npm install -g ganache-cli@6.1.6
    ```

2. Clone this repository.
    ```sh
    git https://github.com/cds-consensys/auction
    cd auction
    ```

3. Install npm packages.
    ```sh
    npm install
    ```

4. Run the development blockchain. Note, that increasing the blocktime to 3
   seconds prevents some race conditions. This value specifies the interval
   between blocks being mined on the development blockchain.
    ```sh
    ganache-cli -b 3
    ```

5. Compile and migrate the smart contracts.
    ```sh
    truffle compile
    truffle migrate
    ```

6. Run the development server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```sh
    cd front-end
    npm run start
    ```
7. visit http://localhost:3000 to interact with the front end. To simulate
   multiple users, install metamask on another browser and login in with
   different accounts.

### Version Notice
1. Node v9.11.2
2. Ganache CLI v6.1.8 (ganache-core: 2.2.1)
3. Truffle v4.1.14 (core: 4.1.14) with Solidity v0.4.24 (solc-js)

### Heroku
The project has been deployed to heroku: https://auction-house-dapp.herokuapp.com/
