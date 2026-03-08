// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address recipient, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract SimpleDEX {
    address public token0;
    address public token1;

    uint112 public reserve0;
    uint112 public reserve1;

    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    uint constant FEE = 3; // 0.3% fee

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    // ---------------------------
    // INTERNAL HELPERS
    // ---------------------------
    function _updateReserves(uint _balance0, uint _balance1) private {
        reserve0 = uint112(_balance0);
        reserve1 = uint112(_balance1);
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x < y ? x : y;
    }

    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    // ---------------------------
    // ADD LIQUIDITY
    // ---------------------------
    function addLiquidity(uint amount0, uint amount1) external returns (uint liquidity) {
        require(amount0 > 0 && amount1 > 0, "Invalid amounts");

        IERC20(token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), amount1);

        uint _totalSupply = totalSupply;

        if (_totalSupply == 0) {
            liquidity = _sqrt(amount0 * amount1);
        } else {
            liquidity = _min(
                (amount0 * _totalSupply) / reserve0,
                (amount1 * _totalSupply) / reserve1
            );
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        balanceOf[msg.sender] += liquidity;
        totalSupply += liquidity;

        _updateReserves(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );
    }

    // ---------------------------
    // REMOVE LIQUIDITY
    // ---------------------------
    function removeLiquidity(uint liquidity) external returns (uint amount0, uint amount1) {
        require(liquidity > 0, "Invalid liquidity");


        amount0 = (liquidity * reserve0) / totalSupply;
        amount1 = (liquidity * reserve1) / totalSupply;

        require(amount0 > 0 && amount1 > 0, "Insufficient amounts");

        balanceOf[msg.sender] -= liquidity;
        totalSupply -= liquidity;

        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);

        _updateReserves(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );
    }

    // ---------------------------
    // SWAP
    // ---------------------------
    function swap(address tokenIn, uint amountIn) external returns (uint amountOut) {
        require(amountIn > 0, "Invalid input");
        require(tokenIn == token0 || tokenIn == token1, "Invalid token");

        bool isToken0 = tokenIn == token0;

        (uint reserveIn, uint reserveOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Apply fee
        uint amountInWithFee = (amountIn * (1000 - FEE)) / 1000;

        // x * y = k
        amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

        require(amountOut > 0, "Insufficient output");

        address tokenOut = isToken0 ? token1 : token0;
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        _updateReserves(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );
    }

    // ---------------------------
    // VIEW FUNCTION
    // ---------------------------
    function getPrice(address _token) external view returns (uint) {
        require(_token == token0 || _token == token1, "Invalid token");

        if (_token == token0) {
            return (reserve1 * 1e18) / reserve0;
        } else {
            return (reserve0 * 1e18) / reserve1;
        }
    }
}