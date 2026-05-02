import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../multiAuth";
import { web3Service } from "../web3Service";
import { insertWeb3WalletSchema, insertCryptoHoldingSchema, insertDefiPositionSchema, insertDefiTransactionSchema, insertYieldFarmingPositionSchema, insertNftHoldingSchema } from "@shared/schema";
import { z } from "zod";

export function registerTokenomicRoutes(app: Express) {
  // ===========================================
  // Web3 and Cryptocurrency APIs (Tokenomics)
  // ===========================================

  // Get user's connected wallets
  app.get('/api/web3/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const wallets = await storage.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Add a new wallet
  app.post('/api/web3/wallets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const walletData = insertWeb3WalletSchema.parse({
        ...req.body,
        userId
      });

      const wallet = await storage.createWallet(walletData);
      res.status(201).json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wallet data", errors: error.errors });
      }
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  // Get wallet portfolio
  app.get('/api/web3/wallets/:walletId/portfolio', isAuthenticated, async (req: any, res) => {
    try {
      const { walletId } = req.params;
      const userId = req.user.id;
      
      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const portfolio = await web3Service.getWalletPortfolio(walletId);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching wallet portfolio:", error);
      res.status(500).json({ message: "Failed to fetch wallet portfolio" });
    }
  });

  // Get crypto holdings
  app.get('/api/web3/holdings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const holdings = await storage.getCryptoHoldings(userId);
      res.json(holdings);
    } catch (error) {
      console.error("Error fetching crypto holdings:", error);
      res.status(500).json({ message: "Failed to fetch crypto holdings" });
    }
  });

  // Sync wallet data
  app.post('/api/web3/wallets/:walletId/sync', isAuthenticated, async (req: any, res) => {
    try {
      const { walletId } = req.params;
      const userId = req.user.id;
      
      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      // Sync wallet data from blockchain
      const syncResult = await web3Service.syncWalletData(walletId);
      
      // Update holdings in storage
      for (const holding of syncResult.holdings) {
        await storage.upsertCryptoHolding({
          ...holding,
          userId,
          walletId
        });
      }

      // Update DeFi positions
      for (const position of syncResult.defiPositions) {
        await storage.upsertDefiPosition({
          ...position,
          userId,
          walletId
        });
      }

      res.json({
        message: "Wallet synced successfully",
        syncedAt: new Date().toISOString(),
        holdingsUpdated: syncResult.holdings.length,
        defiPositionsUpdated: syncResult.defiPositions.length
      });
    } catch (error) {
      console.error("Error syncing wallet:", error);
      res.status(500).json({ message: "Failed to sync wallet" });
    }
  });

  // Get DeFi positions
  app.get('/api/web3/defi/positions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const positions = await storage.getDefiPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching DeFi positions:", error);
      res.status(500).json({ message: "Failed to fetch DeFi positions" });
    }
  });

  // Get DeFi transactions
  app.get('/api/web3/defi/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;
      
      const transactions = await storage.getDefiTransactions(userId, parseInt(limit as string), parseInt(offset as string));
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching DeFi transactions:", error);
      res.status(500).json({ message: "Failed to fetch DeFi transactions" });
    }
  });

  // Get DeFi protocol information
  app.get('/api/web3/defi/protocols/:protocol', async (req, res) => {
    try {
      const { protocol } = req.params;
      const protocolInfo = await web3Service.getProtocolInfo(protocol);
      
      if (!protocolInfo) {
        return res.status(404).json({ message: "Protocol not found" });
      }

      res.json(protocolInfo);
    } catch (error) {
      console.error("Error fetching protocol info:", error);
      res.status(500).json({ message: "Failed to fetch protocol information" });
    }
  });

  // Get NFT holdings
  app.get('/api/web3/nfts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const nfts = await storage.getNftHoldings(userId);
      res.json(nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get gas prices for different chains
  app.get('/api/web3/gas/:chainId', async (req, res) => {
    try {
      const { chainId } = req.params;
      const gasPrice = await web3Service.getGasPrice(parseInt(chainId));
      res.json(gasPrice);
    } catch (error) {
      console.error("Error fetching gas price:", error);
      res.status(500).json({ message: "Failed to fetch gas price" });
    }
  });

  // Get yield farming positions
  app.get('/api/web3/yield-farming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const yieldPositions = await storage.getYieldFarmingPositions(userId);
      res.json(yieldPositions);
    } catch (error) {
      console.error("Error fetching yield farming positions:", error);
      res.status(500).json({ message: "Failed to fetch yield farming positions" });
    }
  });

  // Create yield farming position
  app.post('/api/web3/yield-farming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const positionData = insertYieldFarmingPositionSchema.parse({
        ...req.body,
        userId
      });

      const position = await storage.createYieldFarmingPosition(positionData);
      res.status(201).json(position);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid position data", errors: error.errors });
      }
      console.error("Error creating yield farming position:", error);
      res.status(500).json({ message: "Failed to create yield farming position" });
    }
  });

  // Get blockchain network status
  app.get('/api/web3/networks', async (req, res) => {
    try {
      const networks = await web3Service.getNetworkStatus();
      res.json(networks);
    } catch (error) {
      console.error("Error fetching network status:", error);
      res.status(500).json({ message: "Failed to fetch network status" });
    }
  });

  // Get token prices
  app.get('/api/web3/tokens/prices', async (req, res) => {
    try {
      const { tokens } = req.query;
      if (!tokens) {
        return res.status(400).json({ message: "Tokens parameter required" });
      }

      const tokenList = (tokens as string).split(',');
      const prices = await web3Service.getTokenPrices(tokenList);
      res.json(prices);
    } catch (error) {
      console.error("Error fetching token prices:", error);
      res.status(500).json({ message: "Failed to fetch token prices" });
    }
  });

  // Get DeFi TVL data
  app.get('/api/web3/defi/tvl', async (req, res) => {
    try {
      const { protocol } = req.query;
      const tvlData = await web3Service.getTVLData(protocol as string);
      res.json(tvlData);
    } catch (error) {
      console.error("Error fetching TVL data:", error);
      res.status(500).json({ message: "Failed to fetch TVL data" });
    }
  });

  // Smart Contract Interactions
  app.post('/api/web3/smart-contracts/deploy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { contractType, parameters, walletId } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const deployment = await web3Service.deploySmartContract(contractType, parameters, walletId);
      res.json(deployment);
    } catch (error) {
      console.error("Error deploying smart contract:", error);
      res.status(500).json({ message: "Failed to deploy smart contract" });
    }
  });

  // Get smart contract information
  app.get('/api/web3/smart-contracts/:contractAddress', async (req, res) => {
    try {
      const { contractAddress } = req.params;
      const { chainId } = req.query;
      
      const contractInfo = await web3Service.getSmartContractInfo(contractAddress, parseInt(chainId as string));
      res.json(contractInfo);
    } catch (error) {
      console.error("Error fetching smart contract info:", error);
      res.status(500).json({ message: "Failed to fetch smart contract information" });
    }
  });

  // Execute smart contract function
  app.post('/api/web3/smart-contracts/:contractAddress/execute', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { contractAddress } = req.params;
      const { functionName, parameters, walletId, chainId } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const result = await web3Service.executeSmartContractFunction(
        contractAddress,
        functionName,
        parameters,
        walletId,
        chainId
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error executing smart contract function:", error);
      res.status(500).json({ message: "Failed to execute smart contract function" });
    }
  });

  // Staking operations
  app.post('/api/web3/staking/stake', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { tokenAddress, amount, validatorAddress, walletId, chainId } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const stakingResult = await web3Service.stakeTokens(
        tokenAddress,
        amount,
        validatorAddress,
        walletId,
        chainId
      );
      
      res.json(stakingResult);
    } catch (error) {
      console.error("Error staking tokens:", error);
      res.status(500).json({ message: "Failed to stake tokens" });
    }
  });

  // Get staking positions
  app.get('/api/web3/staking/positions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stakingPositions = await storage.getStakingPositions(userId);
      res.json(stakingPositions);
    } catch (error) {
      console.error("Error fetching staking positions:", error);
      res.status(500).json({ message: "Failed to fetch staking positions" });
    }
  });

  // Unstake tokens
  app.post('/api/web3/staking/unstake', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { stakingPositionId, amount, walletId } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const unstakingResult = await web3Service.unstakeTokens(stakingPositionId, amount, walletId);
      res.json(unstakingResult);
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      res.status(500).json({ message: "Failed to unstake tokens" });
    }
  });

  // Cross-chain bridge operations
  app.post('/api/web3/bridge/transfer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { fromChainId, toChainId, tokenAddress, amount, walletId } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const bridgeResult = await web3Service.bridgeTokens(
        fromChainId,
        toChainId,
        tokenAddress,
        amount,
        walletId
      );
      
      res.json(bridgeResult);
    } catch (error) {
      console.error("Error bridging tokens:", error);
      res.status(500).json({ message: "Failed to bridge tokens" });
    }
  });

  // Get bridge transaction status
  app.get('/api/web3/bridge/status/:transactionHash', async (req, res) => {
    try {
      const { transactionHash } = req.params;
      const { chainId } = req.query;
      
      const bridgeStatus = await web3Service.getBridgeTransactionStatus(
        transactionHash,
        parseInt(chainId as string)
      );
      
      res.json(bridgeStatus);
    } catch (error) {
      console.error("Error fetching bridge status:", error);
      res.status(500).json({ message: "Failed to fetch bridge status" });
    }
  });

  // Governance operations
  app.get('/api/web3/governance/proposals', async (req, res) => {
    try {
      const { protocol, status } = req.query;
      const proposals = await web3Service.getGovernanceProposals(protocol as string, status as string);
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching governance proposals:", error);
      res.status(500).json({ message: "Failed to fetch governance proposals" });
    }
  });

  app.post('/api/web3/governance/vote', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { proposalId, vote, walletId, votingPower } = req.body;

      // Verify wallet ownership
      const wallet = await storage.getWallet(walletId);
      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      const voteResult = await web3Service.castGovernanceVote(
        proposalId,
        vote,
        walletId,
        votingPower
      );
      
      res.json(voteResult);
    } catch (error) {
      console.error("Error casting governance vote:", error);
      res.status(500).json({ message: "Failed to cast governance vote" });
    }
  });

}