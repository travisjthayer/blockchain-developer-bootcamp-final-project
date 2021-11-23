# Design Pattern Decisions

## Access Control Design Patterns

- `onlyOwner` modifier used to limit certain functionality to the contract deployer.  For testing purposes, the `onlyOwner` modifier applies to the following functions: `destroyContract` and `getAllFiles`.

Note that these functions would unlikely be present in a production version of this type of contract.  However, for testing purposes these are important due to the nature of the dApp.

Other administrative functions may be needed in a production version such as contract upgradability.

## Inheritance and Interfaces

- `EthStorage` contract inherits the OpenZeppelin `Counters` contract.  `Counters` provides a counter that can only be incremented or decremented by one, and therefore, it is not possible to overflow a 256 bit integer.

`Counters` documentation: https://docs.openzeppelin.com/contracts/3.x/api/utils#Counters

