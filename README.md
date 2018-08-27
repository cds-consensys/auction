# Auction Smart Contract

This truffle project explores how to use the Ethereum platform and the
Interplanetary File System (IPFS) to implement an open auction. Storing data on
Ethereum is expensive, so the approach is reference off chain data on IPFS. This
works well as the hashes are manageable and inexpensive to store.

## User stories

1. As user I want to auction something.
![Create Auction Screenshot](https://raw.githubusercontent.com/cds-consensys/auction/readme/docs/img/create-an-auction.png)



## Getting started
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
   between blocks being mined on the dev blockchain.
    ```sh
    cd ..
    // 3 second blocktime.
    ganache-cli -b 3
    ```

5. Compile and migrate the smart contracts.
    ```sh
    truffle compile
    truffle migrate
    ```

6. Run the dev server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```sh
    cd front-end
    npm run start
    ```
7. visit http://localhost:3000 to interact with the front end.

### Important Notes
1. Node v9.11.2
2. Ganache CLI v6.1.8 (ganache-core: 2.2.1)
3. Truffle v4.1.14 (core: 4.1.14) with Solidity v0.4.24 (solc-js)
