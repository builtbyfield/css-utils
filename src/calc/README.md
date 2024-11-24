# CSS Calc Utility

A TypeScript utility for creating CSS `calc()` expressions with a chainable API.
This is a localized version of [@vanilla-extract/css-utils](https://github.com/vanilla-extract-css/vanilla-extract/tree/master/packages/utils). We've localized
it to be used in our projects as we've found it to be a useful utility and this
helps us to expand on it alongside our other CSS utilities.

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

```typescript
import { calc } from '@builtbyfield/css-utils';

// Basic operations
calc.add('100px', '20px') // calc(100px + 20px)
calc.subtract('100px', '20px') // calc(100px - 20px)
calc.multiply('100px', 2) // calc(100px 2)
calc.divide('100px', 2) // calc(100px / 2)
calc.negate('100px') // calc(100px -1)

// Chainable operations
calc('100px')
  .add('20px')
  .multiply(2)
  .divide(3)
  .toString() // calc(((100px + 20px) 2) / 3)

// Complex expressions
calc('100vh')
  .subtract('20px')
  .multiply(0.5)
  .toString() // calc((100vh - 20px) 0.5)
```

## API

### Static Methods

- `calc.add(...operands)` - Adds multiple operands
- `calc.subtract(...operands)` - Subtracts multiple operands
- `calc.multiply(...operands)` - Multiplies multiple operands
- `calc.divide(...operands)` - Divides multiple operands
- `calc.negate(operand)` - Negates an operand

### Chainable Methods

When using the `calc(initialValue)` function, you get access to chainable methods:

- `.add(...operands)` - Adds to the current value
- `.subtract(...operands)` - Subtracts from the current value
- `.multiply(...operands)` - Multiplies the current value
- `.divide(...operands)` - Divides the current value
- `.negate()` - Negates the current value
- `.toString()` - Converts the calculation to a CSS calc() string

## Types

```typescript
type Operator = "+" | "-" | "" | "/";
type Operand = string | number | CalcChain;
```

## Why would you use this?

This utility is useful for creating complex CSS `calc()` expressions in a type-safe manner.

Working with `calc()` expressions can be tricky, as they can get very complex very quickly.
This utility helps to keep things type-safe and readable. It also helps to ensure that
your expressions are valid, as it will throw an error if they are not.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
