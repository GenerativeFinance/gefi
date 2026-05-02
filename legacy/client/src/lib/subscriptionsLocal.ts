const STORE_KEY = 'gefi.local.subscriptions';

export type LocalSubscription = {
  id: string; // local id
  modelId: number | string;
  modelName: string;
  developerName?: string;
  price: number;
  billingCycle: 'monthly' | 'annually';
  status: 'active' | 'paused' | 'trial' | 'cancelled';
  subscribedDate: string;
  nextBilling?: string | null;
  category?: string;
  performance?: string; // purely cosmetic
};

function read(): LocalSubscription[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items: LocalSubscription[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getLocalSubscriptions(): LocalSubscription[] {
  return read();
}

export function addLocalSubscription(sub: Omit<LocalSubscription, 'id' | 'subscribedDate' | 'status'> & Partial<Pick<LocalSubscription, 'status' | 'subscribedDate'>>) {
  const list = read();
  const existingIdx = list.findIndex(s => String(s.modelId) === String(sub.modelId));
  const now = new Date().toISOString();

  const record: LocalSubscription = {
    id: `local_${sub.modelId}_${Date.now()}`,
    modelId: sub.modelId,
    modelName: sub.modelName,
    developerName: sub.developerName,
    price: sub.price,
    billingCycle: sub.billingCycle || 'monthly',
    status: sub.status || 'active',
    subscribedDate: sub.subscribedDate || now,
    nextBilling: sub.nextBilling ?? null,
    category: sub.category,
    performance: sub.performance,
  };

  if (existingIdx >= 0) {
    list[existingIdx] = record;
  } else {
    list.push(record);
  }
  write(list);
  return record;
}

export function mergeSubscriptions(primary: any[], local: LocalSubscription[]) {
  // Merge by modelId; prefer primary (server) if present
  const byModel = new Map<string, any>();
  (primary || []).forEach(p => {
    const key = String(p.modelId ?? p.id ?? p.model?.id ?? '');
    if (key) byModel.set(key, p);
  });
  (local || []).forEach(l => {
    const key = String(l.modelId);
    if (!byModel.has(key)) {
      byModel.set(key, l);
    }
  });
  return Array.from(byModel.values());
}