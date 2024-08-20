//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./GiGToken.sol";
import "./GiGTune.sol";

event EnrollTune(uint256 tokenId, uint128 maximumScore, uint128 minimumScore, uint256 competitionFee, uint competitionDeadline);

event ParticipateCompetition(uint256 tokenId, address account, uint256 ticketId);

event SyncCompetitionResult(uint256 tokenId, address account, uint128 score, int rank);

contract GiGCampaign is Initializable, OwnableUpgradeable {
    uint8 private constant _MAX_LEADERBOARD_SIZE = 5;
    uint[5] private _REWARD_RATIO;

    uint128 private constant _COMPETITION_FEE_TUNE_OWNER_RATIO = 20;
    uint128 private constant _COMPETITION_FEE_REWARD_RATIO = 70;

    address private _gigTokenContract;
    address private _gigTuneContract;

    uint256 private _nextTicketId;

    mapping (uint256 tokenId => mapping (address => uint128)) _tune_leaderboard;
    mapping (uint256 tokenId => address[]) _tune_leaders;

    mapping (uint256 tokenId => uint128) _tune_score_maximum;
    mapping (uint256 tokenId => uint128) _tune_score_minimum;

    mapping (uint256 tokenId => uint256) _tune_reward_pool;

    mapping (uint256 tokenId => uint256) _tune_competition_fee;
    mapping (uint256 tokenId => uint) _tune_competition_deadline;

    mapping (uint256 tokenId => bool) _tune_competition_completed;

    function initialize(
        address gigTokenContract,
        address gigTuneContract
    ) public initializer {
        __Ownable_init(msg.sender);
        _gigTokenContract = gigTokenContract;
        _gigTuneContract = gigTuneContract;
        _nextTicketId = 0;
    }

    function enroll_tune(uint256 tokenId, uint128 maximumScore, uint128 minimumScore, uint256 competitionFee, uint competitionDeadline) public {
        require(competitionFee > 0, "competition fee must be greater than zero!");
        require(maximumScore > 0, "maximum score must be greater than zero!");
        require(minimumScore > 0, "minimun score must be greater than zero!");

        _REWARD_RATIO = [100, 70, 45, 30, 20];

        _tune_score_maximum[tokenId] = maximumScore;
        _tune_score_minimum[tokenId] = minimumScore;

        _tune_reward_pool[tokenId] = 0;

        _tune_competition_fee[tokenId] = competitionFee;
        _tune_competition_deadline[tokenId] = competitionDeadline;

        _tune_competition_completed[tokenId] = false;
        
        emit EnrollTune(tokenId, maximumScore, minimumScore, competitionFee, competitionDeadline);
    }

    function competition_fee(uint256 tokenId) public view returns (uint256) {
        require(_tune_competition_fee[tokenId] > 0, "tune isn't exist");

        return _tune_competition_fee[tokenId];
    }

    function participate_competition(address account, uint256 tokenId) public returns (uint256) {
        require(_tune_competition_deadline[tokenId] > block.timestamp, "competition deadline is over!");

        uint256 fee = competition_fee(tokenId);
        uint256 balance = GiGToken(_gigTokenContract).balanceOf(account);
        require(balance >= fee, "not enough balance!");

        GiGToken(_gigTokenContract).transferFrom(account, address(this), fee);

        address tuneOwner = GiGTune(_gigTuneContract).ownerOf(tokenId);
        uint256 tuneOwnerReward = fee * _COMPETITION_FEE_TUNE_OWNER_RATIO / 100;
        GiGToken(_gigTokenContract).approve(address(this), tuneOwnerReward);
        GiGToken(_gigTokenContract).transfer(tuneOwner, tuneOwnerReward);
        uint256 competitionReward = fee * _COMPETITION_FEE_REWARD_RATIO / 100;
        _tune_reward_pool[tokenId] += competitionReward;


        uint256 ticketId = _nextTicketId++;
        emit ParticipateCompetition(tokenId, account, ticketId);

        return ticketId;
    }

    function sync_competition_result(uint256 tokenId, address account, uint128 score) public onlyOwner returns (int) {
        require(_tune_competition_deadline[tokenId] > block.timestamp, "competition deadline is over!");

        require(_tune_competition_completed[tokenId] == false, "competition is already completed!");

        if (score < _tune_score_minimum[tokenId]) {
            return -1;
        }

        if (score >= _tune_leaderboard[tokenId][account]) {
            return -1;
        }

        if (_tune_leaders[tokenId].length == _MAX_LEADERBOARD_SIZE) {
            if (_tune_leaderboard[tokenId][account] > 0) {
                for (uint i = 0; i < _tune_leaders[tokenId].length; i++) {
                    if (_tune_leaders[tokenId][i] == account) {
                        for (uint j = i; j < _tune_leaders[tokenId].length - 1; j++) {
                            _tune_leaders[tokenId][j] = _tune_leaders[tokenId][j + 1];
                        }
                        break;
                    }
                }
            } else {
                address last = _tune_leaders[tokenId][_MAX_LEADERBOARD_SIZE - 1];
                delete _tune_leaderboard[tokenId][last];
            }
            _tune_leaders[tokenId].pop();
            _tune_leaderboard[tokenId][account] = score;
        }

        _tune_leaderboard[tokenId][account] = score;
        uint rank = _tune_leaders[tokenId].length;
        for (uint i = _tune_leaders[tokenId].length - 1; i >= 0; i--) {
            if (_tune_leaderboard[tokenId][_tune_leaders[tokenId][i]] >= score) {
                _tune_leaders[tokenId][rank] = account;
                break;
            }
            rank = i;
            _tune_leaders[tokenId][i + 1] = _tune_leaders[tokenId][i];
        }

        if (score == _tune_score_maximum[tokenId]) {
            _tune_competition_completed[tokenId] = true;
        }

        uint256 reward = _tune_reward_pool[tokenId] * _REWARD_RATIO[rank] / 100;
        _tune_reward_pool[tokenId] -= reward;

        GiGToken(_gigTokenContract).approve(address(this), reward);
        GiGToken(_gigTokenContract).transfer(account, reward);

        emit SyncCompetitionResult(tokenId, account, score, int(rank));

        return int(rank);
    }
}