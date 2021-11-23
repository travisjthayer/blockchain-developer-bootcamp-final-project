var EthStorage = artifacts.require("./EthStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(EthStorage);
};
