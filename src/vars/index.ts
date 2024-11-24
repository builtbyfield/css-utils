import cssesc from "cssesc";

import type {
  CSSVarDefinition,
  CSSVarFunction,
  CSSVarName,
  CSSVarOptions,
} from "./types";

// Cache regex patterns
const CSS_VAR_FUNCTION_PATTERN = /^var\(--[a-zA-Z0-9_-]+(?:,\s*[^)]*\)?)*\)$/;
const CSS_VAR_NAME_EXTRACTOR = /^var\((.*)\)$/;

/**
 * Validates a CSS custom property name according to CSS spec.
 * Custom properties must:
 * - Begin with two dashes (--)
 * - Are case-sensitive
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot start with a digit
 */
function validateCSSCustomPropertyName(name: string): boolean {
  if (!name) return false;

  // Remove leading -- if present for validation
  const propertyName = name.startsWith("--") ? name.slice(2) : name;

  // First check if it's a valid CSS identifier pattern
  if (!/^[a-zA-Z_\-\\][a-zA-Z0-9_\-\\]*$/.test(propertyName)) {
    return false;
  }

  // Validate non-escaped parts
  const parts = propertyName.split(/\\[0-9a-fA-F]{1,6}\s?/);
  return parts.every((part) => {
    if (!part) return true; // Empty parts are OK between escape sequences
    const escaped = cssesc(part, { isIdentifier: true });
    return escaped === part;
  });
}

/**
 * Checks if a name is a valid CSS variable name without -- prefix.
 *
 * @param name - The name to validate
 * @returns True if the name is a valid CSS variable name, false otherwise
 *
 * @example
 * isValidCSSVarName('my-var')    // true
 * isValidCSSVarName('--my-var')  // false
 */
export function isValidCSSVarName(name: string): boolean {
  return validateCSSCustomPropertyName(name);
}

/**
 * Checks if a string is a valid CSS custom property name (including --).
 * According to the CSS spec, custom properties:
 * - Must begin with two dashes (--)
 * - Are case-sensitive
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot start with a digit after the dashes
 *
 * @param value - The value to validate
 * @returns True if the value is a valid CSS variable name (including --), false otherwise
 *
 * @example
 * isCSSVarName('--my-var')  // true
 * isCSSVarName('my-var')    // false
 */
export function isCSSVarName(value: string): value is CSSVarName {
  if (!value.startsWith("--")) return false;
  if (value === "--") return false;
  if (value.startsWith("---")) return false;
  return validateCSSCustomPropertyName(value);
}

/**
 * Creates a CSS variable function with optional fallback.
 *
 * @param name - The name of the CSS variable
 * @param options - Optional options for the CSS variable
 * @returns A CSS variable function
 *
 * @example
 * createCSSVar('my-var')  // var(--my-var)
 * createCSSVar('my-var', { fallback: '#fff' })  // var(--my-var, #fff)
 */
export function createCSSVar(
  name: string,
  options?: CSSVarOptions
): CSSVarFunction {
  if (!name) {
    throw new Error("CSS variable name cannot be empty");
  }

  if (!isValidCSSVarName(name)) {
    throw new Error(
      `Invalid CSS variable name: "${name}". Names must:\n` +
        "- Start with a letter, underscore, or hyphen\n" +
        "- Contain only letters, numbers, underscores, hyphens, or escaped unicode\n" +
        "- Not contain spaces or special characters"
    );
  }

  // Preserve the original escaped sequences in the output
  return options?.fallback
    ? (`var(--${name}, ${options.fallback})` as const)
    : (`var(--${name})` as const);
}

/**
 * Type guard to check if a string is a valid CSS var function
 */
function isCSSVarFunction(value: string): value is CSSVarFunction {
  return CSS_VAR_FUNCTION_PATTERN.test(value);
}

/**
 * Creates a fallback CSS variable function.
 *
 * @param values - The values to fallback to
 * @returns A CSS variable function with fallback
 *
 * @example
 * fallbackCSSVar('var(--my-var)', '#fff')  // var(--my-var, #fff)
 */
export function fallbackCSSVar(
  ...values: [string, ...Array<string>]
): CSSVarFunction {
  // Cache the first check result
  const allValidExceptLast = values
    .slice(0, -1)
    .every((val) => CSS_VAR_FUNCTION_PATTERN.test(val));

  if (!allValidExceptLast) {
    throw new Error(
      "All values except the last must be valid CSS variable functions"
    );
  }

  // Build the fallback chain more efficiently
  const result = values.reduceRight((acc, value, index) => {
    if (index === values.length - 1) return value;
    return value.replace(/\)$/, `, ${acc})`);
  }, "");

  if (!isCSSVarFunction(result)) {
    throw new Error("Invalid CSS variable function created");
  }

  return result;
}

/**
 * Returns the variable name from a CSS variable function.
 *
 * @param variable - The CSS variable function
 * @returns The variable name
 *
 * @example
 * getCSSVarName('var(--my-var)')  // --my-var
 */
export function getCSSVarName(variable: string): string {
  const matches = variable.match(CSS_VAR_NAME_EXTRACTOR);
  return matches ? matches[1].split(",")[0].trim() : variable;
}

/**
 * Assigns a value to a CSS variable.
 *
 * @param variable - The CSS variable function
 * @param value - The value to assign to the CSS variable
 * @returns The CSS variable definition
 *
 * @example
 * assignCSSVar('var(--my-var)', '#fff')  // { '--my-var': '#fff' }
 */
export function assignCSSVar(
  variable: CSSVarFunction,
  value: string | null
): CSSVarDefinition {
  if (value === undefined) {
    throw new Error("CSS variable value cannot be undefined");
  }

  const varName = getCSSVarName(variable);
  if (!varName.startsWith("--")) {
    throw new Error("Invalid CSS variable name");
  }

  if (!isCSSVarName(varName)) {
    throw new Error("Invalid CSS variable name");
  }

  return { [varName]: value };
}
