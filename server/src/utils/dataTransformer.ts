// Contains transformer objects which offer functions to transform data to database format and vice versa

/**
 * Transformer object for boolean values. Transforms boolean values to 1 or 0 and vice versa
 */
export const booleanTransformer = {
  to(value: boolean): number {
    return value ? 1 : 0;
  },
  from(value: number): boolean {
    return value === 1;
  },
};
