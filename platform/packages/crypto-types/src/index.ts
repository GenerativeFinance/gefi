/** Shared commitment / signature type aliases for TS clients. */
export type Hex64 = string;
export type Commitment = string;
export type Signature = string;

export type DomainSeparatedHash = {
  label: string;
  digestHex: Hex64;
};
