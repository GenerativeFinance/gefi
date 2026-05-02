/**
 * Auth-related types. Re-exports the shared shape and adds the runtime
 * shape of a verified user JWT (`GefiAuthClaims`) plus the permission
 * vocabulary for the RBAC engine.
 */

import type { EntityType, KycTier, Persona, Region, SubscriptionTier } from "@gefi/shared-types";

/**
 * Custom-claim namespace prefix Auth0 uses when emitting our claims. Auth0
 * requires custom claims to live under a URL-shaped namespace; the GeFi
 * Auth0 Action sets:
 *
 *     ${GEFI_CLAIM_NS}jurisdiction
 *     ${GEFI_CLAIM_NS}entity_type
 *     ${GEFI_CLAIM_NS}tenant_id
 *     ${GEFI_CLAIM_NS}roles
 *     ${GEFI_CLAIM_NS}kyc_tier
 *     ${GEFI_CLAIM_NS}subscription_tier
 *
 * The verifier flattens these into the unnamespaced `GefiAuthClaims` shape
 * below so application code never has to care about the URL.
 */
export const GEFI_CLAIM_NS = "https://gefi.io/" as const;

/** Standard JWT claims we care about. */
export interface StandardClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  azp?: string;
  scope?: string;
}

/** Custom GeFi claims as they appear *after* namespace flattening. */
export interface GefiCustomClaims {
  jurisdiction: Region;
  entity_type: EntityType;
  tenant_id: string;
  roles: Persona[];
  kyc_tier?: KycTier;
  subscription_tier?: SubscriptionTier;
  email?: string;
  email_verified?: boolean;
}

/** A fully verified, hydrated GeFi auth principal. */
export interface GefiAuthClaims extends StandardClaims, GefiCustomClaims {}

/**
 * Action verbs in the RBAC vocabulary. Kept deliberately small — adding a
 * new verb is fine, but resist the urge to invent fine-grained ones
 * (`approve`, `unlock`, etc.) when an existing verb plus a resource
 * suffices.
 */
export type Action = "create" | "read" | "update" | "delete" | "list" | "publish";

/**
 * Resources protected by the RBAC matrix. Add new resources here when a
 * new feature ships; do NOT pluralise (use `model`, not `models`).
 */
export type Resource =
  | "model"
  | "subscription"
  | "audit_log"
  | "compliance_event"
  | "tenant"
  | "user"
  | "api_key"
  | "kyc_evidence"
  | "research_note"
  | "dataset";

/** A single permission, e.g. `"read:audit_log"` or `"publish:model"`. */
export type Permission = `${Action}:${Resource}`;
