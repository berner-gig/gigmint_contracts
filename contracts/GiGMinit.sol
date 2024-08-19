//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./GiGToken.sol";
import "./GiGTune.sol";
import "./GiGCampaign.sol";

contract GiGMint is Initializable, OwnableUpgradeable {
    address private _tokenContract;
    address private _tuneContract;
    address private _campaignContract;

    function initialize(
        address tokenContract,
        address tuneCountract,
        address campaignContract
    ) public initializer {
        __Ownable_init(msg.sender);
        _tokenContract = tokenContract;
        _tuneContract = tuneCountract;
        _campaignContract = campaignContract;
    }

    function mint_tune(address owner, string memory tokenURI, uint128 maximumScore, uint128 minimumScore, uint256 competitionFee, uint competitionDeadline) external {
        uint256 tokenId = GiGTune(_tuneContract).mint(owner, tokenURI);
        GiGCampaign(_campaignContract).enroll_tune(tokenId, maximumScore, minimumScore, competitionFee, competitionDeadline);
    }

    function competition_fee(uint256 tuneId) external view returns (uint256) {
        return GiGCampaign(_campaignContract).competition_fee(tuneId);
    }

    function participate_competition(address account, uint256 tokenId) external returns (uint256) {
        return GiGCampaign(_campaignContract).participate_competition(account, tokenId);
    }
}