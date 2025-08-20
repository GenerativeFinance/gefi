/**
 * Local storage utility for managing subscription state
 * Enables instant reflection of newly subscribed models in the UI
 * before server persistence is implemented.
 */

export interface LocalSubscription {
  modelId: number;
  modelName: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'pending' | 'cancelled' | 'past_due' | 'trialing';
  subscribedDate: string;
  nextBilling?: string;
  developerName?: string;
  category?: string;
}

const LOCAL_STORAGE_KEY = 'gefi_local_subscriptions';

/**
 * Save a new active subscription record locally
 */
export function addLocalSubscription(subscription: LocalSubscription): void {
  try {
    const existingSubscriptions = getLocalSubscriptions();
    
    // Check if subscription already exists for this model
    const existingIndex = existingSubscriptions.findIndex(
      sub => sub.modelId === subscription.modelId
    );
    
    if (existingIndex >= 0) {
      // Update existing subscription
      existingSubscriptions[existingIndex] = subscription;
    } else {
      // Add new subscription
      existingSubscriptions.push(subscription);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingSubscriptions));
  } catch (error) {
    console.error('Failed to save subscription to local storage:', error);
  }
}

/**
 * Read locally saved subscriptions
 */
export function getLocalSubscriptions(): LocalSubscription[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read subscriptions from local storage:', error);
    return [];
  }
}

/**
 * Merge server-provided (or mock) subscriptions with local ones by modelId
 * Local subscriptions take precedence for the same modelId
 */
export function mergeSubscriptions(
  serverSubscriptions: any[], 
  localSubscriptions?: LocalSubscription[]
): any[] {
  const local = localSubscriptions || getLocalSubscriptions();
  const merged = [...serverSubscriptions];
  
  // Add or update with local subscriptions
  local.forEach(localSub => {
    const existingIndex = merged.findIndex(
      serverSub => serverSub.modelId === localSub.modelId || serverSub.id === localSub.modelId
    );
    
    if (existingIndex >= 0) {
      // Update existing with local data
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...localSub,
        id: merged[existingIndex].id || localSub.modelId
      };
    } else {
      // Add new local subscription
      merged.push({
        ...localSub,
        id: localSub.modelId
      });
    }
  });
  
  return merged;
}

/**
 * Remove a local subscription by model ID
 */
export function removeLocalSubscription(modelId: number): void {
  try {
    const existingSubscriptions = getLocalSubscriptions();
    const filteredSubscriptions = existingSubscriptions.filter(
      sub => sub.modelId !== modelId
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredSubscriptions));
  } catch (error) {
    console.error('Failed to remove subscription from local storage:', error);
  }
}

/**
 * Check if user is subscribed to a specific model (including local subscriptions)
 */
export function isUserSubscribedLocal(modelId: number, serverSubscriptions: any[] = []): boolean {
  const localSubscriptions = getLocalSubscriptions();
  const merged = mergeSubscriptions(serverSubscriptions, localSubscriptions);
  
  return merged.some(sub => 
    (sub.modelId === modelId || sub.id === modelId) && 
    sub.status === 'active'
  );
}

/**
 * Get subscription details for a specific model
 */
export function getSubscriptionByModelId(modelId: number, serverSubscriptions: any[] = []): any | null {
  const localSubscriptions = getLocalSubscriptions();
  const merged = mergeSubscriptions(serverSubscriptions, localSubscriptions);
  
  return merged.find(sub => 
    (sub.modelId === modelId || sub.id === modelId) && 
    sub.status === 'active'
  ) || null;
}

/**
 * Clear all local subscriptions (useful for logout/reset)
 */
export function clearLocalSubscriptions(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear local subscriptions:', error);
  }
}