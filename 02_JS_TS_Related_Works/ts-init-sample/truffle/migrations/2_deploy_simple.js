const SimpleApp = artifacts.require("Simple");

module.exports = function (deployer) {
  deployer.deploy(SimpleApp);
};
