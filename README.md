## Tested versions

1. Node v9.11.2
2. Ganache CLI v6.1.6 (ganache-core: 2.1.5)
3. Truffle v4.1.12 (core: 4.1.12) with Solidity v0.4.24 (solc-js)

## Run Boilerplate sample app locally

1. Install Truffle and Ganache CLI globally. (or the GUI version of Ganache, alternatively)
    ```sh
    npm install -g truffle@4.1.12
    npm install -g ganache-cli@6.1.6
    ```

2. Clone this repository.
    ```sh
    git clone https://gitlab.com/cosmicApotheosis/cra-truffle.git
    cd cra-truffle/front-end
    ```

3. Install npm packages.
    ```sh
    npm install
    ```

4. Run the development blockchain.
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
    // Serves the front-end on http://localhost:3000
    npm run start
    ```
