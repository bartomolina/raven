// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IReviewMenuItem} from "./interfaces/IReviewMenuItem.sol";

contract ReviewMenuItem is IReviewMenuItem {
    mapping(uint256 => uint256) private totalVotes;
    mapping(uint256 => uint256) private voteCount;

    event ReviewPosted(uint8 vote, uint256 publication, address actor);

    function reviewMenuItem(
        uint8 vote,
        uint256 publication,
        address actor
    ) external {
        emit ReviewPosted(vote, publication, actor);
        totalVotes[publication] += vote;
        voteCount[publication] += 1;
    }

    function getAverageVote(uint256 publication) public view returns (uint8) {
        require(voteCount[publication] > 0, "No votes for this publication");
        return uint8(totalVotes[publication] / voteCount[publication]);
    }
}
