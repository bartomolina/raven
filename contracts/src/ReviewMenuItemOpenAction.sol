// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {HubRestricted} from "lens/HubRestricted.sol";
import {Types} from "lens/Types.sol";
import {IPublicationActionModule} from "./interfaces/IPublicationActionModule.sol";
import {IReviewMenuItem} from "./interfaces/IReviewMenuItem.sol";

contract ReviewMenuItemOpenAction is HubRestricted, IPublicationActionModule {
    mapping(uint256 pubId => uint256 avgScore) public reviews;
    IReviewMenuItem internal _reviewMenuItem;

    constructor(
        address lensHubProxyContract,
        address reviewMenuItemsContract
    ) HubRestricted(lensHubProxyContract) {
        _reviewMenuItem = IReviewMenuItem(reviewMenuItemsContract);
    }

    function initializePublicationAction(
        uint256 profileId,
        uint256 pubId,
        address /* transactionExecutor */,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        return data;
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata params
    ) external override onlyHub returns (bytes memory) {
        uint8 vote = abi.decode(params.actionModuleData, (uint8));

        _reviewMenuItem.reviewMenuItem(
            vote,
            params.publicationActedId,
            params.transactionExecutor
        );

        return abi.encode(vote);
    }
}
