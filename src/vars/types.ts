/**
 * Options for creating a CSS variable.
 * @property fallback - Optional fallback value if the CSS variable is not defined
 */
export interface CSSVarOptions {
  fallback?: string;
}

/**
 * CSS variable / custom property name.
 * Must start with '--' per CSS spec.
 * @example '--my-var', '--color-primary'
 */
export type CSSVarName = `--${string}`;

/**
 * CSS variable / custom property function.
 * Represents the var() CSS function with optional fallback.
 * @example 'var(--my-var)' or 'var(--my-var, #fff)'
 */
export type CSSVarFunction =
  | `var(${CSSVarName})`
  | `var(${CSSVarName}, ${string})`;

/**
 * CSS variable definition object
 */
export interface CSSVarDefinition {
  name: CSSVarName;
  value: string | null;
  fallback?: string;
}
