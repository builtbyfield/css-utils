# CSS Variables Utility

A type-safe utility library for working with CSS Custom Properties (CSS Variables) in TypeScript applications.

## Features

- Type-safe CSS variable creation and manipulation
- Validation of CSS custom property names
- Support for fallback values
- Utility functions for working with CSS variables
- Zero dependencies (except for `cssesc` for proper CSS escaping)

## Installation

```bash
# Using npm
npm install @builtbyfield/css-utils

# Using yarn
yarn add @builtbyfield/css-utils

# Using pnpm
pnpm add @builtbyfield/css-utils
```

## Usage

### Creating CSS Variables

```typescript
import { createCSSVar } from '@builtbyfield/css-utils'
// Simple variable
const bgColor = createCSSVar('background-color')
// Result: var(--background-color)
// With fallback
const textColor = createCSSVar('text-color', { fallback: '#000' })
// Result: var(--text-color, #000)
```

### Creating Fallback Chains

```typescript
import { fallbackCSSVar, createCSSVar } from '@builtbyfield/css-utils'
const primary = createCSSVar('primary')
const secondary = createCSSVar('secondary')
const fallbackColor = fallbackCSSVar(primary, secondary, '#default')
// Result: var(--primary, var(--secondary, #default))
```

### Assigning Values to CSS Variables

```typescript
import { assignCSSVar, createCSSVar } from '@builtbyfield/css-utils'
const bgColor = createCSSVar('background-color')
const cssVar = assignCSSVar(bgColor, "#ffffff");
// Result: { '--background-color': '#ffffff' }
```

### Validation Functions

```typescript
import { isValidCSSVarName, isCSSVarName } from '@builtbyfield/css-utils'
// Validate a CSS variable name (without --)
isValidCSSVarName('my-var') // true
isValidCSSVarName('123var') // false
// Validate a complete CSS variable name (including --)
isCSSVarName('--my-var') // true
isCSSVarName('my-var') // false
```

### Extracting Variable Names

```typescript
import { getCSSVarName } from '@builtbyfield/css-utils'
const varName = getCSSVarName('var(--my-color, #fff)')
// Result: '--my-color'
```

## API Reference

| Function            | Description                                                                 | Parameters                                            | Return Type           |
| ------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------- |
| `createCSSVar`      | Creates a CSS variable function with optional fallback value                | `name: string`<br>`options?: CSSVarOptions`           | `CSSVarFunction`      |
| `fallbackCSSVar`    | Creates a CSS variable function with multiple fallbacks                     | `...values: [string, ...Array<string>]`               | `CSSVarFunction`      |
| `assignCSSVar`      | Assigns a value to a CSS variable                                           | `variable: CSSVarFunction`<br>`value: string \| null` | `CSSVarDefinition`    |
| `isValidCSSVarName` | Validates a CSS variable name without the -- prefix                         | `name: string`                                        | `boolean`             |
| `isCSSVarName`      | Type guard to check if a string is a valid CSS variable name (including --) | `value: string`                                       | `value is CSSVarName` |
| `getCSSVarName`     | Extracts the variable name from a CSS variable function                     | `variable: string`                                    | `string`              |

## Type Safety

The library provides TypeScript types for all functions and ensures type safety:

```typescript
import type {
CSSVarDefinition,
CSSVarFunction,
CSSVarName,
CSSVarOptions
} from '@builtbyfield/css-utils'
```

## CSS Variable Name Rules

Valid CSS custom property names must:

- Begin with two dashes (--)
- Be case-sensitive
- Contain only letters, numbers, underscores, and hyphens
- Not start with a digit after the dashes
- Not contain spaces or special characters (unless properly escaped)

## Error Handling

The library throws descriptive errors for invalid inputs:

- Invalid CSS variable names
- Empty variable names
- Undefined values
- Invalid fallback chains

## Browser Support

The library is designed to work in modern browsers that support CSS variables.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This library was loosely inspired by [vanilla-extract](https://vanilla-extract.style/)'s [`vars.ts`](https://github.com/vanilla-extract-css/vanilla-extract/blob/dde9bf2d15120e546be372390fa562384a48f99b/packages/css/src/vars.ts)
