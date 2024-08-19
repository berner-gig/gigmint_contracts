
require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: "0.8.24",
  networks: {
    bsc_testnet: {
      url: "https://bsc-testnet.bnbchain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  }
};
