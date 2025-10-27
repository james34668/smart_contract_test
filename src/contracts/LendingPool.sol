// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LendingPool
 * @dev Core lending protocol contract
 * @notice This contract needs to be deployed by candidates as part of the hiring test
 */
contract LendingPool is ReentrancyGuard, Ownable {
    struct LendingPosition {
        uint256 amount;
        uint256 interestRate;
        uint256 timestamp;
        bool active;
    }
    
    struct BorrowPosition {
        uint256 borrowedAmount;
        uint256 collateralAmount;
        uint256 interestRate;
        uint256 timestamp;
        bool active;
    }
    
    // User address => Asset address => Lending Position
    mapping(address => mapping(address => LendingPosition)) public lendingPositions;
    
    // User address => Asset address => Borrow Position
    mapping(address => mapping(address => BorrowPosition)) public borrowPositions;
    
    // Asset address => Total supplied
    mapping(address => uint256) public totalSupplied;
    
    // Asset address => Total borrowed
    mapping(address => uint256) public totalBorrowed;
    
    // Interest rate model: base rate 2%, utilization multiplier 10%
    uint256 public constant BASE_RATE = 200; // 2% in basis points
    uint256 public constant UTILIZATION_MULTIPLIER = 1000; // 10% in basis points
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80% in basis points
    uint256 public constant COLLATERAL_RATIO = 15000; // 150% in basis points
    
    event Deposit(address indexed user, address indexed asset, uint256 amount);
    event Withdraw(address indexed user, address indexed asset, uint256 amount);
    event Borrow(address indexed user, address indexed asset, uint256 amount, uint256 collateral);
    event Repay(address indexed user, address indexed asset, uint256 amount);
    event Liquidation(address indexed borrower, address indexed liquidator, address indexed asset, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Deposit assets to earn interest
     */
    function deposit(address asset, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // TODO Implement deposit logic here
        
        emit Deposit(msg.sender, asset, amount);
    }
    
    /**
     * @dev Withdraw deposited assets plus interest
     */
    function withdraw(address asset, uint256 amount) external nonReentrant {
        LendingPosition storage position = lendingPositions[msg.sender][asset];
        require(position.active, "No active position");
        
        // TODO Implement withdraw logic here
        
        emit Withdraw(msg.sender, asset, amount);
    }
    
    /**
     * @dev Borrow assets with collateral
     */
    function borrow(address asset, uint256 amount, uint256 collateralAmount) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(collateralAmount > 0, "Collateral must be greater than 0");
        
        // Verify collateral ratio (must be at least 150%)
        require(collateralAmount >= (amount * COLLATERAL_RATIO) / 10000, "Insufficient collateral");
        require(amount <= getAvailableLiquidity(asset), "Insufficient liquidity");
        
        // Transfer collateral (assuming ETH for simplicity)
        require(msg.value == collateralAmount, "Incorrect collateral amount");
        
        // TODO Implement borrow logic here
        
        emit Borrow(msg.sender, asset, amount, collateralAmount);
    }
    
    /**
     * @dev Repay borrowed assets
     */
    function repay(address asset, uint256 amount) external nonReentrant {
        // TODO Implement repay logic here
        
        emit Repay(msg.sender, asset, amount);
    }
    
    /**
     * @dev Liquidate undercollateralized positions
     */
    function liquidate(address borrower, address asset) external nonReentrant {
        // TODO Implement liquidate logic here
        
        emit Liquidation(borrower, msg.sender, asset, totalDebt);
    }
    
    /**
     * @dev Calculate lending interest rate based on utilization
     */
    function calculateLendingRate(address asset) public view returns (uint256) {
        if (totalSupplied[asset] == 0) return BASE_RATE;
        
        uint256 utilizationRate = (totalBorrowed[asset] * 10000) / totalSupplied[asset];
        return BASE_RATE + (utilizationRate * UTILIZATION_MULTIPLIER) / 10000;
    }
    
    /**
     * @dev Calculate borrowing interest rate (lending rate + 2%)
     */
    function calculateBorrowingRate(address asset) public view returns (uint256) {
        return calculateLendingRate(asset) + 200; // +2%
    }
    
    /**
     * @dev Calculate accrued lending interest for a user
     */
    function calculateLendingInterest(address user, address asset) public view returns (uint256) {
        LendingPosition memory position = lendingPositions[user][asset];
        if (!position.active) return 0;
        
        uint256 timeElapsed = block.timestamp - position.timestamp;
        uint256 annualInterest = (position.amount * position.interestRate) / 10000;
        return (annualInterest * timeElapsed) / 365 days;
    }
    
    /**
     * @dev Calculate accrued borrowing interest for a user
     */
    function calculateBorrowingInterest(address user, address asset) public view returns (uint256) {
        BorrowPosition memory position = borrowPositions[user][asset];
        if (!position.active) return 0;
        
        uint256 timeElapsed = block.timestamp - position.timestamp;
        uint256 annualInterest = (position.borrowedAmount * position.interestRate) / 10000;
        return (annualInterest * timeElapsed) / 365 days;
    }
    
    /**
     * @dev Calculate health factor (collateral value / borrowed value)
     */
    function calculateHealthFactor(address user, address asset) public view returns (uint256) {
        BorrowPosition memory position = borrowPositions[user][asset];
        if (!position.active) return type(uint256).max;
        
        uint256 interest = calculateBorrowingInterest(user, asset);
        uint256 totalDebt = position.borrowedAmount + interest;
        
        if (totalDebt == 0) return type(uint256).max;
        
        // Health factor = (collateral value * liquidation threshold) / total debt
        return (position.collateralAmount * LIQUIDATION_THRESHOLD) / totalDebt;
    }
    
    /**
     * @dev Get available liquidity for an asset
     */
    function getAvailableLiquidity(address asset) public view returns (uint256) {
        return totalSupplied[asset] - totalBorrowed[asset];
    }
    
    /**
     * @dev Get total value locked
     */
    function getTotalValueLocked() external view returns (uint256) {
        // This would need to aggregate across all assets
        // Implementation depends on price oracle integration
        return 0;
    }
}
