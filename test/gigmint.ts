// import { expect } from "chai";
// import { BigNumber } from "ethers";
import { deploy_token, deploy_tune, deploy_campaign, deploy_gigmint } from "./deploy";

describe("GiGMinit", function () {
  it("participate competition", async function () {
    const tokenContract = await deploy_token();
    const tuneContract = await deploy_tune();

    const campaignContract = await deploy_campaign(await tokenContract.getAddress(), await tuneContract.getAddress());

    const gigmintContract = await deploy_gigmint(await tokenContract.getAddress(), await tuneContract.getAddress(), await campaignContract.getAddress());

    await gigmintContract.mint_tune('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '', BigInt("3000"), BigInt("2000"), BigInt("50000000000000000000"), BigInt("1755619200"));

    console.log("mint tune success");

    await tokenContract.approve(await tuneContract.getAddress(), BigInt("5000000000000000000000"));
    await tokenContract.approve(await campaignContract.getAddress(), BigInt("5000000000000000000000"));
    await tokenContract.approve(await gigmintContract.getAddress(), BigInt("5000000000000000000000"));

    console.log("campaign contract allowance: ", await tokenContract.allowance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', await campaignContract.getAddress()));

    let ticket = await gigmintContract.participate_competition('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', BigInt("0"));

    // assert that the value is correct
    // expect().to.greaterThanOrEqual(0);
  });
});
