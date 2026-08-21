// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RevenueSharing
 * @dev Smart contract for transparent revenue sharing in AI financial models
 */
contract RevenueSharing {
    struct Model {
        address developer;
        string modelId;
        uint256 totalRevenue;
        uint256 developerShare; // Percentage (e.g., 70 = 70%)
        uint256 platformShare; // Percentage (e.g., 30 = 30%)
        bool isActive;
        mapping(address => uint256) investorShares; // investor => percentage
        address[] investors;
        uint256 totalInvestorShares;
    }

    struct RevenueDistribution {
        uint256 timestamp;
        uint256 amount;
        address model;
        uint256 developerAmount;
        uint256 platformAmount;
        uint256 investorAmount;
    }

    mapping(string => Model) public models;
    mapping(address => uint256) public pendingWithdrawals;
    mapping(string => RevenueDistribution[]) public revenueHistory;
    
    address public owner;
    address public platformWallet;
    uint256 public constant MAX_PERCENTAGE = 100;
    
    event ModelRegistered(string indexed modelId, address indexed developer);
    event InvestorAdded(string indexed modelId, address indexed investor, uint256 share);
    event RevenueDistributed(string indexed modelId, uint256 amount, uint256 timestamp);
    event WithdrawalMade(address indexed user, uint256 amount);
    event ModelDeactivated(string indexed modelId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier nonReentrant() {
        _;
    }

    constructor(address _platformWallet) {
        owner = msg.sender;
        platformWallet = _platformWallet;
    }

    /**
     * @dev Register a new AI model for revenue sharing
     */
    function registerModel(
        string memory _modelId,
        address _developer,
        uint256 _developerShare,
        uint256 _platformShare
    ) external onlyOwner {
        require(_developerShare + _platformShare <= MAX_PERCENTAGE, "Shares exceed 100%");
        require(models[_modelId].developer == address(0), "Model already registered");

        Model storage model = models[_modelId];
        model.developer = _developer;
        model.modelId = _modelId;
        model.developerShare = _developerShare;
        model.platformShare = _platformShare;
        model.isActive = true;
        model.totalInvestorShares = 0;

        emit ModelRegistered(_modelId, _developer);
    }

    /**
     * @dev Add investor to a model with specific share percentage
     */
    function addInvestor(
        string memory _modelId,
        address _investor,
        uint256 _sharePercentage
    ) external onlyOwner {
        Model storage model = models[_modelId];
        require(model.isActive, "Model not active");
        require(model.investorShares[_investor] == 0, "Investor already exists");
        
        uint256 newTotalInvestorShares = model.totalInvestorShares + _sharePercentage;
        uint256 availableForInvestors = MAX_PERCENTAGE - model.developerShare - model.platformShare;
        
        require(newTotalInvestorShares <= availableForInvestors, "Investor shares exceed available percentage");

        model.investorShares[_investor] = _sharePercentage;
        model.investors.push(_investor);
        model.totalInvestorShares = newTotalInvestorShares;

        emit InvestorAdded(_modelId, _investor, _sharePercentage);
    }

    /**
     * @dev Distribute revenue for a specific model
     */
    function distributeRevenue(string memory _modelId) external payable nonReentrant {
        require(msg.value > 0, "No revenue to distribute");
        
        Model storage model = models[_modelId];
        require(model.isActive, "Model not active");

        uint256 revenue = msg.value;
        model.totalRevenue = model.totalRevenue + revenue;

        // Calculate distributions
        uint256 developerAmount = (revenue * model.developerShare) / MAX_PERCENTAGE;
        uint256 platformAmount = (revenue * model.platformShare) / MAX_PERCENTAGE;
        uint256 totalInvestorAmount = revenue - developerAmount - platformAmount;

        // Distribute to developer
        pendingWithdrawals[model.developer] = pendingWithdrawals[model.developer] + developerAmount;

        // Distribute to platform
        pendingWithdrawals[platformWallet] = pendingWithdrawals[platformWallet] + platformAmount;

        // Distribute to investors
        for (uint256 i = 0; i < model.investors.length; i++) {
            address investor = model.investors[i];
            uint256 investorShare = model.investorShares[investor];
            uint256 investorAmount = (totalInvestorAmount * investorShare) / model.totalInvestorShares;
            
            if (investorAmount > 0) {
                pendingWithdrawals[investor] = pendingWithdrawals[investor] + investorAmount;
            }
        }

        // Record distribution
        RevenueDistribution memory distribution = RevenueDistribution({
            timestamp: block.timestamp,
            amount: revenue,
            model: address(this),
            developerAmount: developerAmount,
            platformAmount: platformAmount,
            investorAmount: totalInvestorAmount
        });
        
        revenueHistory[_modelId].push(distribution);

        emit RevenueDistributed(_modelId, revenue, block.timestamp);
    }

    /**
     * @dev Withdraw pending earnings
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingWithdrawals[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalMade(msg.sender, amount);
    }

    /**
     * @dev Get pending withdrawal amount for an address
     */
    function getPendingWithdrawal(address _user) external view returns (uint256) {
        return pendingWithdrawals[_user];
    }

    /**
     * @dev Get model information
     */
    function getModelInfo(string memory _modelId) external view returns (
        address developer,
        uint256 totalRevenue,
        uint256 developerShare,
        uint256 platformShare,
        uint256 totalInvestorShares,
        bool isActive
    ) {
        Model storage model = models[_modelId];
        return (
            model.developer,
            model.totalRevenue,
            model.developerShare,
            model.platformShare,
            model.totalInvestorShares,
            model.isActive
        );
    }

    /**
     * @dev Get investor share for a model
     */
    function getInvestorShare(string memory _modelId, address _investor) external view returns (uint256) {
        return models[_modelId].investorShares[_investor];
    }

    /**
     * @dev Get all investors for a model
     */
    function getModelInvestors(string memory _modelId) external view returns (address[] memory) {
        return models[_modelId].investors;
    }

    /**
     * @dev Get revenue history for a model
     */
    function getRevenueHistory(string memory _modelId) external view returns (RevenueDistribution[] memory) {
        return revenueHistory[_modelId];
    }

    /**
     * @dev Deactivate a model (only owner)
     */
    function deactivateModel(string memory _modelId) external onlyOwner {
        models[_modelId].isActive = false;
        emit ModelDeactivated(_modelId);
    }

    /**
     * @dev Update platform wallet (only owner)
     */
    function updatePlatformWallet(address _newPlatformWallet) external onlyOwner {
        platformWallet = _newPlatformWallet;
    }

    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}