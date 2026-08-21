// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Crowdfunding
 * @dev Smart contract for transparent crowdfunding of AI models and trading bots
 */
contract Crowdfunding {
    enum CampaignStatus { Active, Successful, Failed, Cancelled }
    
    struct Campaign {
        address creator;
        string title;
        string description;
        string modelId;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        CampaignStatus status;
        bool fundsWithdrawn;
        mapping(address => uint256) contributions;
        address[] contributors;
        uint256 contributorCount;
        uint256 minContribution;
        uint256 maxContribution;
        string category; // "ai-model", "trading-bot", "research"
    }

    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
        string campaignId;
    }

    mapping(string => Campaign) public campaigns;
    mapping(address => string[]) public userCampaigns;
    mapping(address => Contribution[]) public userContributions;
    
    address public owner;
    uint256 public platformFeePercentage = 5; // 5%
    uint256 public constant MAX_FEE = 10; // Max 10%
    uint256 public totalCampaigns;
    uint256 public totalRaised;
    
    event CampaignCreated(
        string indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );
    
    event ContributionMade(
        string indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 timestamp
    );
    
    event CampaignSuccessful(string indexed campaignId, uint256 totalRaised);
    event CampaignFailed(string indexed campaignId);
    event FundsWithdrawn(string indexed campaignId, address indexed creator, uint256 amount);
    event RefundIssued(string indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignCancelled(string indexed campaignId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier campaignExists(string memory _campaignId) {
        require(campaigns[_campaignId].creator != address(0), "Campaign does not exist");
        _;
    }

    modifier onlyCreator(string memory _campaignId) {
        require(campaigns[_campaignId].creator == msg.sender, "Only creator can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new crowdfunding campaign
     */
    function createCampaign(
        string memory _campaignId,
        string memory _title,
        string memory _description,
        string memory _modelId,
        uint256 _goal,
        uint256 _durationInDays,
        uint256 _minContribution,
        uint256 _maxContribution,
        string memory _category
    ) external {
        require(campaigns[_campaignId].creator == address(0), "Campaign ID already exists");
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        require(_minContribution > 0, "Minimum contribution must be greater than 0");
        require(_maxContribution >= _minContribution, "Maximum contribution must be >= minimum");

        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        Campaign storage campaign = campaigns[_campaignId];
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.modelId = _modelId;
        campaign.goal = _goal;
        campaign.deadline = deadline;
        campaign.status = CampaignStatus.Active;
        campaign.minContribution = _minContribution;
        campaign.maxContribution = _maxContribution;
        campaign.category = _category;

        userCampaigns[msg.sender].push(_campaignId);
        totalCampaigns++;

        emit CampaignCreated(_campaignId, msg.sender, _title, _goal, deadline);
    }

    /**
     * @dev Contribute to a campaign
     */
    function contribute(string memory _campaignId) external payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.status == CampaignStatus.Active, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value >= campaign.minContribution, "Contribution below minimum");
        require(msg.value <= campaign.maxContribution, "Contribution above maximum");

        // Check if this is a new contributor
        if (campaign.contributions[msg.sender] == 0) {
            campaign.contributors.push(msg.sender);
            campaign.contributorCount++;
        }

        campaign.contributions[msg.sender] += msg.value;
        campaign.raised += msg.value;
        totalRaised += msg.value;

        // Record contribution
        Contribution memory contribution = Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            campaignId: _campaignId
        });
        userContributions[msg.sender].push(contribution);

        emit ContributionMade(_campaignId, msg.sender, msg.value, block.timestamp);

        // Check if goal is reached
        if (campaign.raised >= campaign.goal) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignSuccessful(_campaignId, campaign.raised);
        }
    }

    /**
     * @dev Withdraw funds from successful campaign
     */
    function withdrawFunds(string memory _campaignId) external campaignExists(_campaignId) onlyCreator(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.status == CampaignStatus.Successful, "Campaign not successful");
        require(!campaign.fundsWithdrawn, "Funds already withdrawn");
        require(campaign.raised > 0, "No funds to withdraw");

        campaign.fundsWithdrawn = true;

        // Calculate platform fee
        uint256 platformFee = (campaign.raised * platformFeePercentage) / 100;
        uint256 creatorAmount = campaign.raised - platformFee;

        // Transfer funds
        (bool creatorSuccess, ) = payable(campaign.creator).call{value: creatorAmount}("");
        require(creatorSuccess, "Transfer to creator failed");

        if (platformFee > 0) {
            (bool platformSuccess, ) = payable(owner).call{value: platformFee}("");
            require(platformSuccess, "Platform fee transfer failed");
        }

        emit FundsWithdrawn(_campaignId, campaign.creator, creatorAmount);
    }

    /**
     * @dev Request refund for failed campaign
     */
    function requestRefund(string memory _campaignId) external campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(
            campaign.status == CampaignStatus.Failed || 
            (block.timestamp >= campaign.deadline && campaign.raised < campaign.goal),
            "Campaign not eligible for refunds"
        );

        uint256 contributionAmount = campaign.contributions[msg.sender];
        require(contributionAmount > 0, "No contribution to refund");

        // Update campaign status if needed
        if (campaign.status == CampaignStatus.Active && block.timestamp >= campaign.deadline) {
            campaign.status = CampaignStatus.Failed;
            emit CampaignFailed(_campaignId);
        }

        campaign.contributions[msg.sender] = 0;
        campaign.raised -= contributionAmount;

        (bool success, ) = payable(msg.sender).call{value: contributionAmount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(_campaignId, msg.sender, contributionAmount);
    }

    /**
     * @dev Cancel campaign (only creator, only if no contributions)
     */
    function cancelCampaign(string memory _campaignId) external campaignExists(_campaignId) onlyCreator(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.status == CampaignStatus.Active, "Campaign not active");
        require(campaign.raised == 0, "Cannot cancel campaign with contributions");

        campaign.status = CampaignStatus.Cancelled;
        emit CampaignCancelled(_campaignId);
    }

    /**
     * @dev Get campaign information
     */
    function getCampaignInfo(string memory _campaignId) external view returns (
        address creator,
        string memory title,
        string memory description,
        string memory modelId,
        uint256 goal,
        uint256 raised,
        uint256 deadline,
        CampaignStatus status,
        uint256 contributorCount,
        string memory category
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.modelId,
            campaign.goal,
            campaign.raised,
            campaign.deadline,
            campaign.status,
            campaign.contributorCount,
            campaign.category
        );
    }

    /**
     * @dev Get user's contribution to a campaign
     */
    function getUserContribution(string memory _campaignId, address _user) external view returns (uint256) {
        return campaigns[_campaignId].contributions[_user];
    }

    /**
     * @dev Get all contributors of a campaign
     */
    function getCampaignContributors(string memory _campaignId) external view returns (address[] memory) {
        return campaigns[_campaignId].contributors;
    }

    /**
     * @dev Get user's campaigns
     */
    function getUserCampaigns(address _user) external view returns (string[] memory) {
        return userCampaigns[_user];
    }

    /**
     * @dev Get user's contributions
     */
    function getUserContributions(address _user) external view returns (Contribution[] memory) {
        return userContributions[_user];
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= MAX_FEE, "Fee exceeds maximum");
        platformFeePercentage = _newFeePercentage;
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
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalCampaigns,
        uint256 _totalRaised,
        uint256 _platformFee
    ) {
        return (totalCampaigns, totalRaised, platformFeePercentage);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}