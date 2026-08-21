#!/usr/bin/env npx tsx
/**
 * Full reindex script for MeiliSearch
 * Run with: npm run reindex
 */

import { initializeSearchIndexes, bulkIndexDocuments, INDEXES } from '../services/search';
import { storage } from '../storage';

async function reindexModels() {
  console.log('🔄 Reindexing AI Models...');
  
  try {
    const models = await storage.getAIModels();
    
    const docs = models.map(model => ({
      id: String(model.id),
      name: model.name,
      description: model.description,
      category: model.category,
      tags: Array.isArray(model.tags) ? model.tags : [],
      createdAt: model.createdAt,
      visibility: model.visibility || 'public',
      ownerId: model.ownerId || model.developerId
    }));

    if (docs.length > 0) {
      await bulkIndexDocuments(INDEXES.MODELS, docs);
      console.log(`✅ Indexed ${docs.length} AI models`);
    } else {
      console.log('ℹ️ No AI models to index');
    }
  } catch (error) {
    console.error('❌ Error indexing models:', error);
  }
}

async function reindexUsers() {
  console.log('🔄 Reindexing Users...');
  
  try {
    const users = await storage.getUsers();
    
    const docs = users.map(user => ({
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt
    }));

    if (docs.length > 0) {
      await bulkIndexDocuments(INDEXES.USERS, docs);
      console.log(`✅ Indexed ${docs.length} users`);
    } else {
      console.log('ℹ️ No users to index');
    }
  } catch (error) {
    console.error('❌ Error indexing users:', error);
  }
}

async function reindexBounties() {
  console.log('🔄 Reindexing Bounties...');
  
  try {
    const bounties = await storage.getBounties();
    
    const docs = bounties.map(bounty => ({
      id: String(bounty.id),
      title: bounty.title,
      description: bounty.description,
      requirements: bounty.requirements,
      reward: bounty.reward,
      status: bounty.status,
      tags: Array.isArray(bounty.tags) ? bounty.tags : [],
      createdAt: bounty.createdAt,
      ownerId: bounty.ownerId
    }));

    if (docs.length > 0) {
      await bulkIndexDocuments(INDEXES.BOUNTIES, docs);
      console.log(`✅ Indexed ${docs.length} bounties`);
    } else {
      console.log('ℹ️ No bounties to index');
    }
  } catch (error) {
    console.error('❌ Error indexing bounties:', error);
  }
}

async function reindexFunding() {
  console.log('🔄 Reindexing Funding Requests...');
  
  try {
    const fundingRequests = await storage.getFundingRequests();
    
    const docs = fundingRequests.map(funding => ({
      id: String(funding.id),
      title: funding.title,
      description: funding.description,
      amount: funding.amount,
      status: funding.status,
      tags: Array.isArray(funding.tags) ? funding.tags : [],
      createdAt: funding.createdAt,
      ownerId: funding.ownerId
    }));

    if (docs.length > 0) {
      await bulkIndexDocuments(INDEXES.FUNDING, docs);
      console.log(`✅ Indexed ${docs.length} funding requests`);
    } else {
      console.log('ℹ️ No funding requests to index');
    }
  } catch (error) {
    console.error('❌ Error indexing funding requests:', error);
  }
}

async function main() {
  console.log('🚀 Starting MeiliSearch full reindex...');
  
  try {
    // Initialize indexes first
    await initializeSearchIndexes();
    console.log('✅ Search indexes initialized');

    // Reindex all resources
    await Promise.all([
      reindexModels(),
      reindexUsers(),
      reindexBounties(),
      reindexFunding()
    ]);

    console.log('🎉 Full reindex completed successfully!');
    
    console.log('\n📋 Next steps:');
    console.log('1. Verify indexes in MeiliSearch dashboard: http://localhost:7700');
    console.log('2. Test search API: /api/search?q=your-query');
    console.log('3. Test autocomplete: /api/search/autocomplete?q=test&type=models');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Reindex failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main as reindex };