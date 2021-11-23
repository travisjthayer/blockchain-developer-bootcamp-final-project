# Final project - EthStorage

This is my final project for the 2021 Blockchain Developer Bootcamp.

EthStorage is a file storage dApp utilizing IPFS decentralized file storage.

Users are able to upload files to IPFS through the dApp.  Files are assigned to the wallet address used to upload.

Users can only view those files assigned to that wallet address.

## URL for Deployed version - Ropsten Test Network:

https://eloquent-heisenberg-ac6f73.netlify.app/

## Running Tests

- Clone Directory

```git clone https://github.com/travisjthayer/blockchain-developer-bootcamp-final-project```

- Start Ganache - using port 8545

```$ ganache-cli```

- Perform Truffle Test

```$ truffle test```

## Running the Project Locally:

### Prerequisites

- Node.js >= v14

- Truffle - https://www.trufflesuite.com/docs/truffle/overview

```$ npm install -g truffle```

- Ganache CLI - https://github.com/trufflesuite/ganache

```$ npm install ganache-cli@latest --global```

#### Migrate Contracts

```$ truffle migrate --network development```

#### Change to Client Directory

```$ cd client```

### Install Dependencies

```$ npm install```

### Start Web Server

```$ npm run start```

### Browse to site

``` https:\\localhost:3000```

- Login with Metamask Account

    - Note: You will need a funded account.
    - You can utilize one of the accounts created by ganache and import into Metamask



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