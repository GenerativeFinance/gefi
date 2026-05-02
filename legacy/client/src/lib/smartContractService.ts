import { ethers } from 'ethers';

// ABI definitions for smart contracts
const REVENUE_SHARING_ABI = [
  "function addModel(string modelId, address developer) external",
  "function distributeRevenue(string modelId) external payable", 
  "function withdrawRevenue(string modelId) external",
  "function getModelInfo(string modelId) external view returns (address developer, uint256 totalRevenue, bool isActive)",
  "function getPendingRevenue(string modelId) external view returns (uint256)",
  "function updateModelStatus(string modelId, bool isActive) external",
  "event ModelAdded(string indexed modelId, address indexed developer)",
  "event RevenueDistributed(string indexed modelId, uint256 amount, uint256 timestamp)",
  "event RevenueWithdrawn(string indexed modelId, address indexed developer, uint256 amount)"
];

const CROWDFUNDING_ABI = [
  "function createCampaign(string campaignId, string title, string description, string modelId, uint256 goal, uint256 durationInDays, uint256 minContribution, uint256 maxContribution, string category) external",
  "function contribute(string campaignId) external payable",
  "function withdrawFunds(string campaignId) external", 
  "function getCampaignInfo(string campaignId) external view returns (string title, string description, address creator, uint256 goal, uint256 raised, uint256 deadline, uint8 status)",
  "function getContributorInfo(string campaignId, address contributor) external view returns (uint256 amount, uint256 timestamp)",
  "function getCampaignContributors(string campaignId) external view returns (address[])",
  "function getPlatformStats() external view returns (uint256 totalCampaigns, uint256 totalRaised, uint256 platformFee)",
  "event CampaignCreated(string indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event ContributionMade(string indexed campaignId, address indexed contributor, uint256 amount, uint256 timestamp)",
  "event FundsWithdrawn(string indexed campaignId, address indexed creator, uint256 amount)"
];

interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  goal: string;
  raised: string;
  deadline: number;
  status: number;
}

interface PlatformStats {
  totalCampaigns: string;
  totalRaised: string;
  platformFee: string;
}

export class SmartContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private revenueContract: ethers.Contract | null = null;
  private crowdfundingContract: ethers.Contract | null = null;
  private readonly revenueContractAddress = "0x742d35Cc6635C0532925a3b8D25C2E8b2b15b7c1";
  private readonly crowdfundingContractAddress = "0x8b7B8b7B8b7B8b7B8b7B8b7B8b7B8b7B8b7B8b7B";

  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      this.revenueContract = new ethers.Contract(
        this.revenueContractAddress,
        REVENUE_SHARING_ABI,
        this.signer
      );
      
      this.crowdfundingContract = new ethers.Contract(
        this.crowdfundingContractAddress,
        CROWDFUNDING_ABI,
        this.signer
      );
    }
  }

  async connectWallet(): Promise<string[]> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    await this.initialize();
    return accounts;
  }

  async addModel(modelId: string, developer: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.revenueContract) {
      throw new Error('Revenue contract not initialized');
    }
    return await this.revenueContract.addModel(modelId, developer);
  }

  async distributeRevenue(modelId: string, amount: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.revenueContract) {
      throw new Error('Revenue contract not initialized');
    }
    return await this.revenueContract.distributeRevenue(modelId, {
      value: ethers.parseEther(amount)
    });
  }

  async withdrawRevenue(modelId: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.revenueContract) {
      throw new Error('Revenue contract not initialized');
    }
    return await this.revenueContract.withdrawRevenue(modelId);
  }

  async getModelInfo(modelId: string) {
    if (!this.revenueContract) {
      throw new Error('Revenue contract not initialized');
    }
    const result = await this.revenueContract.getModelInfo(modelId);
    return {
      developer: result[0],
      totalRevenue: ethers.formatEther(result[1]),
      isActive: result[2]
    };
  }

  async getPendingRevenue(modelId: string): Promise<string> {
    if (!this.revenueContract) {
      throw new Error('Revenue contract not initialized');
    }
    const result = await this.revenueContract.getPendingRevenue(modelId);
    return ethers.formatEther(result);
  }

  async createCampaign(
    campaignId: string,
    title: string,
    description: string,
    modelId: string,
    goal: string,
    durationInDays: number,
    minContribution: string,
    maxContribution: string,
    category: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.createCampaign(
      campaignId,
      title,
      description,
      modelId,
      ethers.parseEther(goal),
      durationInDays,
      ethers.parseEther(minContribution),
      ethers.parseEther(maxContribution),
      category
    );
  }

  async contributeToCampaign(
    campaignId: string,
    amount: string
  ): Promise<ethers.ContractTransactionResponse> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.contribute(campaignId, {
      value: ethers.parseEther(amount)
    });
  }

  async withdrawCampaignFunds(campaignId: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    return await this.crowdfundingContract.withdrawFunds(campaignId);
  }

  async getCampaignInfo(campaignId: string): Promise<Campaign> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const result = await this.crowdfundingContract.getCampaignInfo(campaignId);
    return {
      id: campaignId,
      title: result[0],
      description: result[1],
      creator: result[2],
      goal: ethers.formatEther(result[3]),
      raised: ethers.formatEther(result[4]),
      deadline: Number(result[5]),
      status: Number(result[6])
    };
  }

  async getPlatformStats(): Promise<PlatformStats> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const result = await this.crowdfundingContract.getPlatformStats();
    return {
      totalCampaigns: result[0].toString(),
      totalRaised: ethers.formatEther(result[1]),
      platformFee: result[2].toString()
    };
  }

  // Event listeners
  onModelAdded(callback: (modelId: string, developer: string) => void) {
    if (!this.revenueContract) return;
    this.revenueContract.on('ModelAdded', callback);
  }

  onRevenueDistributed(callback: (modelId: string, amount: string, timestamp: number) => void) {
    if (!this.revenueContract) return;
    this.revenueContract.on('RevenueDistributed', (modelId, amount, timestamp) => {
      callback(modelId, ethers.formatEther(amount), Number(timestamp));
    });
  }

  onCampaignCreated(callback: (campaignId: string, creator: string, title: string, goal: string, deadline: number) => void) {
    if (!this.crowdfundingContract) return;
    this.crowdfundingContract.on('CampaignCreated', (campaignId, creator, title, goal, deadline) => {
      callback(campaignId, creator, title, ethers.formatEther(goal), Number(deadline));
    });
  }

  onContributionMade(callback: (campaignId: string, contributor: string, amount: string, timestamp: number) => void) {
    if (!this.crowdfundingContract) return;
    this.crowdfundingContract.on('ContributionMade', (campaignId, contributor, amount, timestamp) => {
      callback(campaignId, contributor, ethers.formatEther(amount), Number(timestamp));
    });
  }

  removeAllListeners() {
    this.revenueContract?.removeAllListeners();
    this.crowdfundingContract?.removeAllListeners();
  }
}

export const smartContractService = new SmartContractService();