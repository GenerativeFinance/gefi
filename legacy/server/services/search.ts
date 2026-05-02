import { MeiliSearch } from "meilisearch";

const MEILI_HOST = process.env.MEILI_HOST || "http://127.0.0.1:7700";
const MEILI_KEY = process.env.MEILI_MASTER_KEY || "";

const client = new MeiliSearch({ host: MEILI_HOST, apiKey: MEILI_KEY });

// Index names for different resource types
export const INDEXES = {
  MODELS: 'models',
  STRATEGIES: 'strategies', 
  REPORTS: 'reports',
  USERS: 'users',
  FUNDING: 'funding',
  BOUNTIES: 'bounties'
} as const;

// Initialize MeiliSearch indexes with proper settings
export async function initializeSearchIndexes() {
  try {
    // Models index
    await client.index(INDEXES.MODELS).updateSettings({
      searchableAttributes: ['name', 'description', 'tags', 'category'],
      displayedAttributes: ['id', 'name', 'description', 'category', 'tags', 'createdAt', 'visibility', 'ownerId'],
      filterableAttributes: ['ownerId', 'visibility', 'tags', 'category', 'createdAt'],
      sortableAttributes: ['createdAt', 'name'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    // Strategies index
    await client.index(INDEXES.STRATEGIES).updateSettings({
      searchableAttributes: ['name', 'description', 'tags'],
      displayedAttributes: ['id', 'name', 'description', 'tags', 'createdAt', 'visibility', 'ownerId'],
      filterableAttributes: ['ownerId', 'visibility', 'tags', 'createdAt'],
      sortableAttributes: ['createdAt', 'name'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    // Reports index
    await client.index(INDEXES.REPORTS).updateSettings({
      searchableAttributes: ['title', 'type', 'description'],
      displayedAttributes: ['id', 'title', 'type', 'description', 'createdAt', 'ownerId'],
      filterableAttributes: ['ownerId', 'type', 'createdAt'],
      sortableAttributes: ['createdAt', 'title'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    // Users index (public data only)
    await client.index(INDEXES.USERS).updateSettings({
      searchableAttributes: ['firstName', 'lastName', 'email', 'company'],
      displayedAttributes: ['id', 'firstName', 'lastName', 'company', 'role', 'createdAt'],
      filterableAttributes: ['role', 'company', 'createdAt'],
      sortableAttributes: ['createdAt', 'firstName', 'lastName'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    // Funding index
    await client.index(INDEXES.FUNDING).updateSettings({
      searchableAttributes: ['title', 'description', 'tags'],
      displayedAttributes: ['id', 'title', 'description', 'amount', 'status', 'tags', 'createdAt', 'ownerId'],
      filterableAttributes: ['ownerId', 'status', 'tags', 'createdAt', 'amount'],
      sortableAttributes: ['createdAt', 'amount', 'title'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    // Bounties index
    await client.index(INDEXES.BOUNTIES).updateSettings({
      searchableAttributes: ['title', 'description', 'requirements', 'tags'],
      displayedAttributes: ['id', 'title', 'description', 'reward', 'status', 'tags', 'createdAt', 'ownerId'],
      filterableAttributes: ['ownerId', 'status', 'tags', 'createdAt', 'reward'],
      sortableAttributes: ['createdAt', 'reward', 'title'],
      rankingRules: ['typo', 'words', 'proximity', 'attribute', 'sort', 'exactness']
    });

    console.log('✅ MeiliSearch indexes initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing MeiliSearch indexes:', error);
  }
}

// Generic document operations
export async function indexDocument(indexName: string, doc: any) {
  try {
    const index = client.index(indexName);
    return await index.addDocuments([doc]);
  } catch (error) {
    console.error(`Error indexing document in ${indexName}:`, error);
    throw error;
  }
}

export async function updateDocument(indexName: string, doc: any) {
  try {
    const index = client.index(indexName);
    return await index.addDocuments([doc]); // addDocuments upserts
  } catch (error) {
    console.error(`Error updating document in ${indexName}:`, error);
    throw error;
  }
}

export async function deleteDocument(indexName: string, id: string) {
  try {
    const index = client.index(indexName);
    return await index.deleteDocument(id);
  } catch (error) {
    console.error(`Error deleting document from ${indexName}:`, error);
    throw error;
  }
}

export async function searchIndex(indexName: string, q: string, opts: any = {}) {
  try {
    const index = client.index(indexName);
    return await index.search(q, {
      limit: 10,
      offset: 0,
      ...opts
    });
  } catch (error) {
    console.error(`Error searching ${indexName}:`, error);
    throw error;
  }
}

export async function bulkIndexDocuments(indexName: string, docs: any[]) {
  try {
    const index = client.index(indexName);
    return await index.addDocuments(docs);
  } catch (error) {
    console.error(`Error bulk indexing documents in ${indexName}:`, error);
    throw error;
  }
}

// Resource-specific indexing helpers
export async function indexModel(model: any) {
  const doc = {
    id: String(model.id),
    name: model.name,
    description: model.description,
    category: model.category,
    tags: Array.isArray(model.tags) ? model.tags : [],
    createdAt: model.createdAt,
    visibility: model.visibility || 'public',
    ownerId: model.ownerId || model.developerId
  };
  return indexDocument(INDEXES.MODELS, doc);
}

export async function indexStrategy(strategy: any) {
  const doc = {
    id: String(strategy.id),
    name: strategy.name,
    description: strategy.description,
    tags: Array.isArray(strategy.tags) ? strategy.tags : [],
    createdAt: strategy.createdAt,
    visibility: strategy.visibility || 'public',
    ownerId: strategy.ownerId
  };
  return indexDocument(INDEXES.STRATEGIES, doc);
}

export async function indexReport(report: any) {
  const doc = {
    id: String(report.id),
    title: report.title,
    type: report.type,
    description: report.description,
    createdAt: report.createdAt,
    ownerId: report.ownerId
  };
  return indexDocument(INDEXES.REPORTS, doc);
}

export async function indexUser(user: any) {
  // Only index public, non-sensitive user data
  const doc = {
    id: String(user.id),
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    role: user.role,
    createdAt: user.createdAt
  };
  return indexDocument(INDEXES.USERS, doc);
}

export async function indexFunding(funding: any) {
  const doc = {
    id: String(funding.id),
    title: funding.title,
    description: funding.description,
    amount: funding.amount,
    status: funding.status,
    tags: Array.isArray(funding.tags) ? funding.tags : [],
    createdAt: funding.createdAt,
    ownerId: funding.ownerId
  };
  return indexDocument(INDEXES.FUNDING, doc);
}

export async function indexBounty(bounty: any) {
  const doc = {
    id: String(bounty.id),
    title: bounty.title,
    description: bounty.description,
    requirements: bounty.requirements,
    reward: bounty.reward,
    status: bounty.status,
    tags: Array.isArray(bounty.tags) ? bounty.tags : [],
    createdAt: bounty.createdAt,
    ownerId: bounty.ownerId
  };
  return indexDocument(INDEXES.BOUNTIES, doc);
}

// Health check
export async function checkSearchHealth() {
  try {
    const health = await client.health();
    return { status: 'healthy', health };
  } catch (error) {
    return { status: 'unhealthy', error: String(error) };
  }
}