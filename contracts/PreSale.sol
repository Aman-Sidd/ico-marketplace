// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ICOMarketplaceCore {

    // ---------------------------
    // ERRORS
    // ---------------------------
    error TokenNotSupported();
    error NotCreator();
    error AmountZero();
    error InvalidEtherAmount();
    error ETHTransferFailed();
    error TokenTransferFailed();
    error InsufficientTokenBalance();

    struct TokenDetails {
        address token;
        uint256 price;
        address creator;
        bool supported;
    }

    mapping(address => TokenDetails) public tokenDetails;
    address[] public allTokens;

    // EVENTS (important for indexing)
    event TokenAdded(address indexed token, uint256 price, address indexed creator);
    event TokenPurchased(address indexed token, address indexed buyer, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed creator, uint256 amount);

    receive() external payable {
        revert();
    }

    // ---------------------------
    // CREATE ICO
    // ---------------------------
    function createICOSale(address _token, uint256 _price) external {
        if (_price == 0) revert AmountZero();

        tokenDetails[_token] = TokenDetails({
            token: _token,
            price: _price,
            creator: msg.sender,
            supported: true
        });

        allTokens.push(_token);

        emit TokenAdded(_token, _price, msg.sender);
    }

    // ---------------------------
    // BUY TOKEN
    // ---------------------------
    function buyToken(address _token, uint256 _amount) external payable {

        TokenDetails memory d = tokenDetails[_token];

        if (!d.supported) revert TokenNotSupported();
        if (_amount == 0) revert AmountZero();

        uint256 cost = d.price * _amount;
        if (msg.value != cost) revert InvalidEtherAmount();

        IERC20 token = IERC20(_token);

        if (token.balanceOf(address(this)) < _amount * 1e18)
            revert InsufficientTokenBalance();

        // send ETH
        (bool ok, ) = d.creator.call{value: msg.value}("");
        if (!ok) revert ETHTransferFailed();

        // send tokens
        if (!token.transfer(msg.sender, _amount * 1e18))
            revert TokenTransferFailed();

        emit TokenPurchased(_token, msg.sender, _amount);
    }

    // ---------------------------
    // WITHDRAW
    // ---------------------------
    function withdrawToken(address _token, uint256 _amount) external {

        TokenDetails memory d = tokenDetails[_token];

        if (msg.sender != d.creator) revert NotCreator();

        IERC20 token = IERC20(_token);

        if (token.balanceOf(address(this)) < _amount)
            revert InsufficientTokenBalance();

        if (!token.transfer(msg.sender, _amount))
            revert TokenTransferFailed();

        emit TokenWithdrawn(_token, msg.sender, _amount);
    }

    // ---------------------------
    // MINIMAL GETTERS
    // ---------------------------
    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
}