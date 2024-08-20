import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

import "./tasks/gigmint";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    bsc_testnet: {
      url: "https://bsc-testnet.bnbchain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  }
};

export default config;