// Smart Contract Service for Revenue Sharing and Crowdfunding
// Note: This is a comprehensive implementation that will be integrated with actual smart contracts

// Smart Contract ABIs (Application Binary Interface)
const REVENUE_SHARING_ABI = [
  "function registerModel(string memory _modelId, address _developer, uint256 _developerShare, uint256 _platformShare) external",
  "function addInvestor(string memory _modelId, address _investor, uint256 _sharePercentage) external",
  "function distributeRevenue(string memory _modelId) external payable",
  "function withdraw() external",
  "function getPendingWithdrawal(address _user) external view returns (uint256)",
  "function getModelInfo(string memory _modelId) external view returns (address, uint256, uint256, uint256, uint256, bool)",
  "function getInvestorShare(string memory _modelId, address _investor) external view returns (uint256)",
  "function getModelInvestors(string memory _modelId) external view returns (address[])",
  "function getRevenueHistory(string memory _modelId) external view returns (tuple(uint256,uint256,address,uint256,uint256,uint256)[])",
  "event ModelRegistered(string indexed modelId, address indexed developer)",
  "event InvestorAdded(string indexed modelId, address indexed investor, uint256 share)",
  "event RevenueDistributed(string indexed modelId, uint256 amount, uint256 timestamp)",
  "event WithdrawalMade(address indexed user, uint256 amount)"
];

const CROWDFUNDING_ABI = [
  "function createCampaign(string memory _campaignId, string memory _title, string memory _description, string memory _modelId, uint256 _goal, uint256 _durationInDays, uint256 _minContribution, uint256 _maxContribution, string memory _category) external",
  "function contribute(string memory _campaignId) external payable",
  "function withdrawFunds(string memory _campaignId) external",
  "function requestRefund(string memory _campaignId) external",
  "function cancelCampaign(string memory _campaignId) external",
  "function getCampaignInfo(string memory _campaignId) external view returns (address, string memory, string memory, string memory, uint256, uint256, uint256, uint8, uint256, string memory)",
  "function getUserContribution(string memory _campaignId, address _user) external view returns (uint256)",
  "function getCampaignContributors(string memory _campaignId) external view returns (address[])",
  "function getUserCampaigns(address _user) external view returns (string[])",
  "function getUserContributions(address _user) external view returns (tuple(address,uint256,uint256,string)[])",
  "function getPlatformStats() external view returns (uint256, uint256, uint256)",
  "event CampaignCreated(string indexed campaignId, address indexed creator, string title, uint256 goal, uint256 deadline)",
  "event ContributionMade(string indexed campaignId, address indexed contributor, uint256 amount, uint256 timestamp)",
  "event CampaignSuccessful(string indexed campaignId, uint256 totalRaised)",
  "event CampaignFailed(string indexed campaignId)",
  "event FundsWithdrawn(string indexed campaignId, address indexed creator, uint256 amount)"
];

// Contract addresses (these would be deployed contract addresses)
const CONTRACT_ADDRESSES = {
  REVENUE_SHARING: process.env.VITE_REVENUE_SHARING_CONTRACT || '0x1234567890123456789012345678901234567890',
  CROWDFUNDING: process.env.VITE_CROWDFUNDING_CONTRACT || '0x0987654321098765432109876543210987654321'
};

export interface ModelInfo {
  developer: string;
  totalRevenue: string;
  developerShare: number;
  platformShare: number;
  totalInvestorShares: number;
  isActive: boolean;
}

export interface RevenueDistribution {
  timestamp: number;
  amount: string;
  model: string;
  developerAmount: string;
  platformAmount: string;
  investorAmount: string;
}

export interface CampaignInfo {
  creator: string;
  title: string;
  description: string;
  modelId: string;
  goal: string;
  raised: string;
  deadline: number;
  status: number; // 0: Active, 1: Successful, 2: Failed, 3: Cancelled
  contributorCount: number;
  category: string;
}

export interface Contribution {
  contributor: string;
  amount: string;
  timestamp: number;
  campaignId: string;
}

export class SmartContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private revenueContract: ethers.Contract | null = null;
  private crowdfundingContract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      this.revenueContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REVENUE_SHARING,
        REVENUE_SHARING_ABI,
        this.signer
      );
      
      this.crowdfundingContract = new ethers.Contract(
        CONTRACT_ADDRESSES.CROWDFUNDING,
        CROWDFUNDING_ABI,
        this.signer
      );
    }
  }

  async connectWallet(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await this.provider.listAccounts();
    return accounts;
  }

  // Revenue Sharing Contract Methods
  async registerModel(
    modelId: string,
    developer: string,
    developerShare: number,
    platformShare: number
  ): Promise<ethers.ContractTransaction> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    return await this.revenueContract.registerModel(
      modelId,
      developer,
      developerShare,
      platformShare
    );
  }

  async addInvestor(
    modelId: string,
    investor: string,
    sharePercentage: number
  ): Promise<ethers.ContractTransaction> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    return await this.revenueContract.addInvestor(modelId, investor, sharePercentage);
  }

  async distributeRevenue(
    modelId: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    return await this.revenueContract.distributeRevenue(modelId, {
      value: ethers.parseEther(amount)
    });
  }

  async withdrawRevenue(): Promise<ethers.ContractTransaction> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    return await this.revenueContract.withdraw();
  }

  async getPendingWithdrawal(address: string): Promise<string> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    const amount = await this.revenueContract.getPendingWithdrawal(address);
    return ethers.utils.formatEther(amount);
  }

  async getModelInfo(modelId: string): Promise<ModelInfo> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    const info = await this.revenueContract.getModelInfo(modelId);
    return {
      developer: info[0],
      totalRevenue: ethers.utils.formatEther(info[1]),
      developerShare: info[2].toNumber(),
      platformShare: info[3].toNumber(),
      totalInvestorShares: info[4].toNumber(),
      isActive: info[5]
    };
  }

  async getInvestorShare(modelId: string, investor: string): Promise<number> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    const share = await this.revenueContract.getInvestorShare(modelId, investor);
    return share.toNumber();
  }

  async getModelInvestors(modelId: string): Promise<string[]> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    return await this.revenueContract.getModelInvestors(modelId);
  }

  async getRevenueHistory(modelId: string): Promise<RevenueDistribution[]> {
    if (!this.revenueContract) {
      throw new Error('Revenue sharing contract not initialized');
    }
    
    const history = await this.revenueContract.getRevenueHistory(modelId);
    return history.map((item: any) => ({
      timestamp: item[0].toNumber(),
      amount: ethers.utils.formatEther(item[1]),
      model: item[2],
      developerAmount: ethers.utils.formatEther(item[3]),
      platformAmount: ethers.utils.formatEther(item[4]),
      investorAmount: ethers.utils.formatEther(item[5])
    }));
  }

  // Crowdfunding Contract Methods
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
  ): Promise<ethers.ContractTransaction> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.createCampaign(
      campaignId,
      title,
      description,
      modelId,
      ethers.utils.parseEther(goal),
      durationInDays,
      ethers.utils.parseEther(minContribution),
      ethers.utils.parseEther(maxContribution),
      category
    );
  }

  async contributeToCampaign(
    campaignId: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.contribute(campaignId, {
      value: ethers.utils.parseEther(amount)
    });
  }

  async withdrawCampaignFunds(campaignId: string): Promise<ethers.ContractTransaction> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.withdrawFunds(campaignId);
  }

  async requestCampaignRefund(campaignId: string): Promise<ethers.ContractTransaction> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.requestRefund(campaignId);
  }

  async cancelCampaign(campaignId: string): Promise<ethers.ContractTransaction> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.cancelCampaign(campaignId);
  }

  async getCampaignInfo(campaignId: string): Promise<CampaignInfo> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const info = await this.crowdfundingContract.getCampaignInfo(campaignId);
    return {
      creator: info[0],
      title: info[1],
      description: info[2],
      modelId: info[3],
      goal: ethers.utils.formatEther(info[4]),
      raised: ethers.utils.formatEther(info[5]),
      deadline: info[6].toNumber(),
      status: info[7],
      contributorCount: info[8].toNumber(),
      category: info[9]
    };
  }

  async getUserContribution(campaignId: string, user: string): Promise<string> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const amount = await this.crowdfundingContract.getUserContribution(campaignId, user);
    return ethers.utils.formatEther(amount);
  }

  async getCampaignContributors(campaignId: string): Promise<string[]> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.getCampaignContributors(campaignId);
  }

  async getUserCampaigns(user: string): Promise<string[]> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    return await this.crowdfundingContract.getUserCampaigns(user);
  }

  async getUserContributions(user: string): Promise<Contribution[]> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const contributions = await this.crowdfundingContract.getUserContributions(user);
    return contributions.map((contrib: any) => ({
      contributor: contrib[0],
      amount: ethers.utils.formatEther(contrib[1]),
      timestamp: contrib[2].toNumber(),
      campaignId: contrib[3]
    }));
  }

  async getPlatformStats(): Promise<{ totalCampaigns: number; totalRaised: string; platformFee: number }> {
    if (!this.crowdfundingContract) {
      throw new Error('Crowdfunding contract not initialized');
    }
    
    const stats = await this.crowdfundingContract.getPlatformStats();
    return {
      totalCampaigns: stats[0].toNumber(),
      totalRaised: ethers.utils.formatEther(stats[1]),
      platformFee: stats[2].toNumber()
    };
  }

  // Event Listeners
  onModelRegistered(callback: (modelId: string, developer: string) => void) {
    if (!this.revenueContract) return;
    
    this.revenueContract.on('ModelRegistered', (modelId, developer) => {
      callback(modelId, developer);
    });
  }

  onRevenueDistributed(callback: (modelId: string, amount: string, timestamp: number) => void) {
    if (!this.revenueContract) return;
    
    this.revenueContract.on('RevenueDistributed', (modelId, amount, timestamp) => {
      callback(modelId, ethers.utils.formatEther(amount), timestamp.toNumber());
    });
  }

  onCampaignCreated(callback: (campaignId: string, creator: string, title: string, goal: string, deadline: number) => void) {
    if (!this.crowdfundingContract) return;
    
    this.crowdfundingContract.on('CampaignCreated', (campaignId, creator, title, goal, deadline) => {
      callback(campaignId, creator, title, ethers.utils.formatEther(goal), deadline.toNumber());
    });
  }

  onContributionMade(callback: (campaignId: string, contributor: string, amount: string, timestamp: number) => void) {
    if (!this.crowdfundingContract) return;
    
    this.crowdfundingContract.on('ContributionMade', (campaignId, contributor, amount, timestamp) => {
      callback(campaignId, contributor, ethers.utils.formatEther(amount), timestamp.toNumber());
    });
  }

  // Utility Methods
  async getNetworkInfo(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }
    
    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name
    };
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }
    
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  formatEther(amount: string): string {
    return ethers.utils.formatEther(amount);
  }

  parseEther(amount: string): ethers.BigNumber {
    return ethers.utils.parseEther(amount);
  }
}

export const smartContractService = new SmartContractService();