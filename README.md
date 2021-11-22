# Final project - EthStorage

This is my final project for the 2021 Blockchain Developer Bootcamp.

EthStorage is a file storage dApp utilizing IPFS decentralized file storage.

Users are able to upload files to IPFS through the dApp.  Files are assigned to the wallet address used to upload.

Users can only view those files assigned to that wallet address.

## URL for Deployed version - Ropsten Test Network:

https://n3xt3.com

## Running the Project Locally:

### Prerequisites

- Node.js >= v14
- Truffle
    $ npm install -g truffle
    - truffle documentation: https://www.trufflesuite.com/docs/truffle/overview
- Ganache


## Additional Functionality Planned - Not Yet Implemented

- Ability to Delete Files
    - Since Files are stored on IPFS this may be more a flag to show whether file isDeleted
- Share with other Accounts
    - File owners will be able to share a file with other addresses
- Folders
    - Create folders to better organize files