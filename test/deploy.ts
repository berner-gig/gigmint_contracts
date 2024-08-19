import hre from "hardhat";

export async function deploy_token() {
    const [deployer] = await hre.ethers.getSigners(); 

    console.log("Deploying contracts with the account:", deployer.address);

    const factory = await hre.ethers.getContractFactory("GiGToken");
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log("Contract deployed at:", await contract.getAddress());

    return contract;
}

export async function deploy_tune() {
    const [deployer] = await hre.ethers.getSigners(); 

    console.log("Deploying contracts with the account:", deployer.address);

    const factory = await hre.ethers.getContractFactory("GiGTune");
    const contract = await hre.upgrades.deployProxy(factory, [], { initializer: 'initialize' });

    await contract.waitForDeployment();

    console.log("Contract deployed at:", await contract.getAddress());

    return contract;
}

export async function deploy_campaign(tokenContractAddress: string, tuneContractAddress: string) {
    const [deployer] = await hre.ethers.getSigners(); 

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("token_address: ", `${tokenContractAddress}`);
    console.log("tune_address: ", `${tuneContractAddress}`);

    const factory = await hre.ethers.getContractFactory("GiGCampaign");
    const contract = await hre.upgrades.deployProxy(factory, [`${tokenContractAddress}`, `${tuneContractAddress}`], { initializer: 'initialize' });

    await contract.waitForDeployment();

    console.log("Contract deployed at:", await contract.getAddress());

    return contract;
}

export async function deploy_gigmint(tokenContractAddress: string, tuneContractAddress: string, campaignContractAddress: string) {
    const [deployer] = await hre.ethers.getSigners(); 

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("token_address: ", `${tokenContractAddress}`);
    console.log("tune_address: ", `${tuneContractAddress}`);
    console.log("campaign_address: ", `${campaignContractAddress}`);

    const factory = await hre.ethers.getContractFactory("GiGMint");
    const contract = await hre.upgrades.deployProxy(factory, [`${tokenContractAddress}`, `${tuneContractAddress}`, `${campaignContractAddress}`], { initializer: 'initialize' });

    await contract.waitForDeployment();

    console.log("Contract deployed at:", await contract.getAddress());

    return contract;
}
