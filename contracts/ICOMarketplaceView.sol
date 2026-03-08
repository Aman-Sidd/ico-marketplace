// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICore {
    function allTokens(uint256) external view returns (address);
    function getAllTokens() external view returns (address[] memory);

    function tokenDetails(address)
        external
        view
        returns (
            address token,
            uint256 price,
            address creator,
            bool supported
        );
}

interface IERC20Meta {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
}

contract ICOMarketplaceView {

    struct FullTokenDetails {
        address token;
        string name;
        string symbol;
        uint256 price;
        address creator;
        bool supported;
    }

    ICore public core;

    constructor(address _core) {
        core = ICore(_core);
    }

    function getAllTokensDetailed()
        external
        view
        returns (FullTokenDetails[] memory)
    {
        address[] memory tokens = core.getAllTokens();
        uint256 length = tokens.length;

        FullTokenDetails[] memory result = new FullTokenDetails[](length);

        for (uint256 i = 0; i < length; i++) {
            (
                address tokenAddr,
                uint256 price,
                address creator,
                bool supported
            ) = core.tokenDetails(tokens[i]);

            IERC20Meta meta = IERC20Meta(tokenAddr);

            result[i] = FullTokenDetails({
                token: tokenAddr,
                name: meta.name(),
                symbol: meta.symbol(),
                price: price,
                creator: creator,
                supported: supported
            });
        }

        return result;
    }

    function getTokensByCreator(address _creator)
        external
        view
        returns (FullTokenDetails[] memory)
    {
        address[] memory tokens = core.getAllTokens();

        uint256 count = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            (, , address creator, ) = core.tokenDetails(tokens[i]);
            if (creator == _creator) count++;
        }

        FullTokenDetails[] memory result = new FullTokenDetails[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            (
                address tokenAddr,
                uint256 price,
                address creator,
                bool supported
            ) = core.tokenDetails(tokens[i]);

            if (creator == _creator) {
                IERC20Meta meta = IERC20Meta(tokenAddr);

                result[index] = FullTokenDetails({
                    token: tokenAddr,
                    name: meta.name(),
                    symbol: meta.symbol(),
                    price: price,
                    creator: creator,
                    supported: supported
                });

                index++;
            }
        }

        return result;
    }
}