// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

interface IReviewMenuItem {
    function reviewMenuItem(
        uint8 vote,
        uint256 publication,
        address actor
    ) external;
}
