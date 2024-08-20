import { task } from "hardhat/config";

task("deploy_token", "Deploy GiGMint Token").setAction(async (taskArgs, hre) => {

  const [deployer] = await hre.ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);

  const factory = await hre.ethers.getContractFactory("GiGToken");
  const contract = await factory.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
});

task("deploy_tune", "Deploy GiGMint Tune").setAction(async (taskArgs, hre) => {
  
  const [deployer] = await hre.ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);

  const factory = await hre.ethers.getContractFactory("GiGTune");
  const contract = await hre.upgrades.deployProxy(factory, [], { initializer: 'initialize' });

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
});


task("upgrade_tune", "Upgrade GiGMint Tune").setAction(async (taskArgs, hre) => {
    
    const [deployer] = await hre.ethers.getSigners(); 
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const factory = await hre.ethers.getContractFactory("GiGTune");
    const contract = await hre.upgrades.upgradeProxy(`${process.env.GIGMINT_TUNE_ADDRESS}`, factory);
  
    await contract.waitForDeployment();
  
    console.log("Contract deployed at:", await contract.getAddress());
});


task("deploy_campaign", "Deploy GiGMint Campaign").setAction(async (taskArgs, hre) => {
  
  const [deployer] = await hre.ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("token_address: ", `${process.env.GIGMINT_TOKEN_ADDRESS}`);
  console.log("tune_address: ", `${process.env.GIGMINT_TUNE_ADDRESS}`);

  const factory = await hre.ethers.getContractFactory("GiGCampaign");
  const contract = await hre.upgrades.deployProxy(factory, [`${process.env.GIGMINT_TOKEN_ADDRESS}`, `${process.env.GIGMINT_TUNE_ADDRESS}`], { initializer: 'initialize' });

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
});


task("upgrade_campaign", "Upgrade GiGMint Campaign").setAction(async (taskArgs, hre) => {
    
    const [deployer] = await hre.ethers.getSigners(); 
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const factory = await hre.ethers.getContractFactory("GiGCampaign");
    const contract = await hre.upgrades.upgradeProxy(`${process.env.GIGMINT_CAMPAIGN_ADDRESS}`, factory);
  
    await contract.waitForDeployment();
  
    console.log("Contract deployed at:", await contract.getAddress());
});



task("deploy_gigmint", "Deploy GiGMint").setAction(async (taskArgs, hre) => {
  
  const [deployer] = await hre.ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("token_address: ", `${process.env.GIGMINT_TOKEN_ADDRESS}`);
  console.log("tune_address: ", `${process.env.GIGMINT_TUNE_ADDRESS}`);
  console.log("campaign_address: ", `${process.env.GIGMINT_CAMPAIGN_ADDRESS}`);

  const factory = await hre.ethers.getContractFactory("GiGMint");
  const contract = await hre.upgrades.deployProxy(factory, 
    [`${process.env.GIGMINT_TOKEN_ADDRESS}`, `${process.env.GIGMINT_TUNE_ADDRESS}`, `${process.env.GIGMINT_CAMPAIGN_ADDRESS}`],
    { initializer: 'initialize' });

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
});


task("upgrade_gigmint", "Upgrade GiGMint").setAction(async (taskArgs, hre) => {
    
    const [deployer] = await hre.ethers.getSigners(); 
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const factory = await hre.ethers.getContractFactory("GiGMint");
    const contract = await hre.upgrades.upgradeProxy(`${process.env.GIGMINT_ADDRESS}`, factory);
  
    await contract.waitForDeployment();
  
    console.log("Contract deployed at:", await contract.getAddress());
});
