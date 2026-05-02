/**
 * Aggregated rule set across all jurisdictions. Importing this module is the
 * canonical way for runtime code to walk every rule in the platform.
 */

import type { ComplianceRule } from "../types.js";
import { SEC_RULES } from "./sec.js";
import { FINRA_RULES } from "./finra.js";
import { MIFID_II_RULES } from "./mifid-ii.js";
import { GDPR_RULES } from "./gdpr.js";
import { CCPA_RULES } from "./ccpa.js";
import { FCA_RULES } from "./fca.js";
import { MAS_RULES } from "./mas.js";
import { FINMA_RULES } from "./finma.js";
import { DFSA_RULES } from "./dfsa.js";
import { SAMA_RULES } from "./sama.js";
import { AUSTRAC_RULES } from "./austrac.js";

/** Every rule in the platform, ordered for deterministic iteration. */
export const RULES: readonly ComplianceRule[] = [
  ...SEC_RULES,
  ...FINRA_RULES,
  ...MIFID_II_RULES,
  ...GDPR_RULES,
  ...CCPA_RULES,
  ...FCA_RULES,
  ...MAS_RULES,
  ...FINMA_RULES,
  ...DFSA_RULES,
  ...SAMA_RULES,
  ...AUSTRAC_RULES,
];

export {
  SEC_RULES,
  FINRA_RULES,
  MIFID_II_RULES,
  GDPR_RULES,
  CCPA_RULES,
  FCA_RULES,
  MAS_RULES,
  FINMA_RULES,
  DFSA_RULES,
  SAMA_RULES,
  AUSTRAC_RULES,
};
