/**
 * Privacy budget accountant (Rényi/ε,δ tracking — simplified composition for v0).
 * Refuse additional training when the budget is exhausted.
 */
export type PrivacyBudgetState = {
  modelId: string;
  epsilonTotal: number;
  epsilonSpent: number;
  delta: number;
  accountantVersion: string;
  updatedAt: string;
};

export function createBudget(
  modelId: string,
  epsilonTotal = 4.0,
  delta = 1e-5,
): PrivacyBudgetState {
  return {
    modelId,
    epsilonTotal,
    epsilonSpent: 0,
    delta,
    accountantVersion: "gefi-rdp-basic-v0",
    updatedAt: new Date().toISOString(),
  };
}

export function canSpend(budget: PrivacyBudgetState, epsilon: number): boolean {
  return budget.epsilonSpent + epsilon <= budget.epsilonTotal + 1e-12;
}

export function spendEpsilon(budget: PrivacyBudgetState, epsilon: number): PrivacyBudgetState {
  if (!canSpend(budget, epsilon)) {
    throw new Error("privacy_budget_exhausted");
  }
  budget.epsilonSpent += epsilon;
  budget.updatedAt = new Date().toISOString();
  return budget;
}

export function remaining(budget: PrivacyBudgetState): number {
  return Math.max(0, budget.epsilonTotal - budget.epsilonSpent);
}
