export const commonInvalidValues = [
  // [],
  {},
  new Error("invalid"),
  true,
  false,
  101010,
  7894,
  19781,
  10000,
  -1000,
  -10,
  -1973,
  1.3,
  0.9,
  1000.79,
  -1.9788,
  -2.9754,
  -50.9785,
  -0.00000097,
] as const;

export const invalidAuthenicationSecinaros = [
  { type: "empty", value: [""] },
  { type: "invalid", value: ["adsadasdsad", "invalid-session"] },
] as const;

export const invalidSchemaSecinaros = [
  { type: "missing", values: [undefined, null] },
  { type: "invalid", values: commonInvalidValues },
] as const;

export const missingValues = [undefined, null];
