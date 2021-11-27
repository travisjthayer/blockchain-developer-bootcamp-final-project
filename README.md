# Final project - EthStorage

This is my final project for the 2021 Blockchain Developer Bootcamp.

EthStorage is a file storage dApp utilizing IPFS decentralized file storage.

Users are able to upload files to IPFS through the dApp.  Files are assigned to the wallet address used to upload.

Users can only view those files assigned to that wallet address.

## URL for Deployed version - Ropsten Test Network:

https://eloquent-heisenberg-ac6f73.netlify.app/

## Screencast

https://n3xt3.com

### Prerequisites

- Node.js >= v14 - https://nodejs.org

- Truffle - https://www.trufflesuite.com/docs/truffle/overview

```$ npm install -g truffle```

- Ganache CLI - https://github.com/trufflesuite/ganache

```$ npm install ganache-cli@latest --global```

## Installing on Ganache and Performing Truffle Tests
Following are the steps for setting up the dApp on a local Ganache testnet and performing Truffle tests.

- Clone Directory

```$ git clone https://github.com/travisjthayer/blockchain-developer-bootcamp-final-project```

- Install Dependencies - Note: the package.json in root only contains dependencies for truffle 

```$ npm install```

- Start Ganache - use default port 8545

```$ ganache-cli```

- Migrate Contracts

```$ truffle migrate --network development```

- Perform Truffle Test

```$ truffle test```

## Running the Project on a Local Development Server:
Following are the steps for running the frontend app on a local development server.

### Change to Client Directory

```$ cd client```

### Install Dependencies

```$ npm install```

### Start Web Server

```$ npm run start```

### Browse to site

``` https:\\localhost:3000```

### Login with Metamask Account

    - Note: You will need a funded account.
    - For local testing you can utilize one of the accounts created by ganache and import into Metamask

## Directory Structure

This project was developed using a standard Truffle application.

```$ truffle init```

A create-react-app was then installed.

```$ npx create-react-app client```

The resulting project structure is as follows:

* Client
    - public
    - src
        - React components
        - contractABIs
            - ABIs for deployed smart contracts
        - utils
            - utility helpers
    - package.json
        - Dependencies for site 
* Contracts
    - Solidity contracts for the project
* Migrations
    - Migration files for Truffle
* Test
    - Test files for Truffle
* package.json
    - Dependencies for Truffle (compile, migrate and test)
* truffle-config.js
    - Configuration file for Truffle

## Address for Certificate

* 0xE0b52ED0DA967ff20E102F0cDA6db3c550921524

## Additional Functionality Planned - Not Yet Implemented

- Ability to Delete Files
    - Since Files are stored on IPFS this may be more a flag to show whether file isDeleted
- Share with other Accounts
    - File owners will be able to share a file with other addresses
- Folders
    - Create folders to better organize files
- Display Gas Used
    - Display gas used to upload file
    - connect using ChainLink to pull current cost
    - How much does it cost to store document