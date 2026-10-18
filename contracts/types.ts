// Single source of truth: do not duplicate types in the UI.
export type * from '../packages/core/src/types.js';

// Public mapping and batch function types; implementation stays in Core.
export type { getAbilityDisplay, getAbilityMapping, toNativeScores, dccAbilityModifier,
  isBatchMethod, generateBatch, BatchGenerationError } from '../packages/core/src/index.js';
