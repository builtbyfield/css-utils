# @builtbyfield/css-utils

A collection of type-safe utilities for working with CSS in TypeScript applications.

## Features

- **CSS Variables Utility**: Type-safe creation and manipulation of CSS Custom Properties
- **CSS Calc Utility**: Chainable API for creating CSS `calc()` expressions
- Zero runtime dependencies (except for `cssesc` for proper CSS escaping)
- Comprehensive TypeScript support
- Thoroughly tested utilities

## Installation

```bash
# Using npm
npm install @builtbyfield/css-utils

# Using yarn
yarn add @builtbyfield/css-utils

# Using pnpm
pnpm add @builtbyfield/css-utils
```

## Modules

### CSS Variables Utility

Create and manage CSS Custom Properties with type safety:

```typescript
import { createCSSVar, fallbackCSSVar } from '@builtbyfield/css-utils'

// Simple variable
const bgColor = createCSSVar('background-color')
// Result: var(--background-color)

// With fallback
const textColor = createCSSVar('text-color', { fallback: '#000' })
// Result: var(--text-color, #000)

// Fallback chain
const color = fallbackCSSVar('--primary', '--secondary', '#default')
// Result: var(--primary, var(--secondary, #default))

// Assign a value to a CSS variable
const cssVar = assignCSSVar(bgColor, "#ffffff");
// Result: { '--background-color': '#ffffff' }
// Use case: style={{ ...assignCSSVar(bgColor, "#ffffff") }}
```

[Read more about CSS Variables Utility](src/vars/README.md)

### CSS Calc Utility

Create complex CSS calculations with a chainable API:

```typescript
import { calc } from '@builtbyfield/css-utils'

// Basic operations
calc.add('100px', '20px') // calc(100px + 20px)

// Chainable operations
calc('100vh')
  .subtract('20px')
  .multiply(0.5)
  .toString() // calc((100vh - 20px) * 0.5)
```

[Read more about CSS Calc Utility](src/calc/README.md)

## Type Safety

The library provides comprehensive TypeScript types for all utilities:

```typescript
import type {
  // CSS Variables types
  CSSVarDefinition,
  CSSVarFunction,
  CSSVarName,
  CSSVarOptions,
  
  // CSS Calc types
  Operator,
  Operand,
  CalcChain
} from '@builtbyfield/css-utils'
```

## Error Handling

Both utilities include robust error handling:

- Validation of CSS variable names
- Type checking for calc operations
- Descriptive error messages
- Runtime checks for invalid inputs

## Browser Support

This library is designed for modern browsers that support:

- CSS Custom Properties (CSS Variables)
- CSS `calc()` function

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- CSS Calc utility was inspired by [@vanilla-extract/css-utils](https://github.com/vanilla-extract-css/vanilla-extract/tree/master/packages/utils)
- CSS Variables utility was loosely inspired by [vanilla-extract](https://vanilla-extract.style/)'s `vars.ts`
