/**
 * This is a localized version of @vanilla-extract/css-utils.
 * This code is licensed under the MIT license.
 *
 * Copyright (c) 2021 SEEK
 * Copyright (c) 2024 Jesse McLean, Built by Field
 *
 * @see https://github.com/vanilla-extract-css/vanilla-extract/tree/master/packages/utils
 */

export type Operator = "+" | "-" | "*" | "/";
export type Operand = string | number | CalcChain;

/**
 * Converts an operator and operands into a CSS calc expression.
 *
 * @param operator - The operator to use.
 * @param operands - The operands to use.
 * @returns A CSS calc expression.
 * @example
 * toExpression('+', '1px', '2rem')  // '1px + 2rem'
 * toExpression('*', '2', '50%')     // '2 * 50%'
 */
const toExpression = (operator: Operator, ...operands: Array<Operand>) =>
  operands
    .map((o) => `${o}`)
    .join(` ${operator} `)
    .replace(/calc/g, "");

/**
 * Creates a CSS calc expression for addition.
 *
 * @param operands - The operands to use.
 * @returns A CSS calc expression.
 * @example
 * add('1px', '2rem')        // 'calc(1px + 2rem)'
 * add('100%', '-20px')      // 'calc(100% + -20px)'
 */
const add = (...operands: Array<Operand>) =>
  `calc(${toExpression("+", ...operands)})`;

/**
 * Creates a CSS calc expression for subtraction.
 *
 * @param operands - The operands to use.
 * @returns A CSS calc expression.
 * @example
 * subtract('100%', '20px')  // 'calc(100% - 20px)'
 * subtract('2rem', '1rem')  // 'calc(2rem - 1rem)'
 */
const subtract = (...operands: Array<Operand>) =>
  `calc(${toExpression("-", ...operands)})`;

/**
 * Creates a CSS calc expression for subtraction.
 *
 * @param operands - The operands to use.
 * @returns A CSS calc expression.
 * @example
 * subtract('100%', '20px')  // 'calc(100% - 20px)'
 * subtract('2rem', '1rem')  // 'calc(2rem - 1rem)'
 */
const multiply = (...operands: Array<Operand>) =>
  `calc(${toExpression("*", ...operands)})`;

/**
 * Creates a CSS calc expression for subtraction.
 *
 * @param operands - The operands to use.
 * @returns A CSS calc expression.
 * @example
 * subtract('100%', '20px')  // 'calc(100% - 20px)'
 * subtract('2rem', '1rem')  // 'calc(2rem - 1rem)'
 */
const divide = (...operands: Array<Operand>) =>
  `calc(${toExpression("/", ...operands)})`;

/**
 * Creates a CSS calc expression for negation
 *
 * @param x - The operand to negate.
 * @returns A CSS calc expression.
 * @example
 * negate('10px')            // 'calc(10px * -1)'
 * negate('25%')             // 'calc(25% * -1)'
 */
const negate = (x: Operand) => multiply(x, -1);

/**
 * A chainable interface for creating CSS calc expressions.
 */
export type CalcChain = {
  add: (...operands: Array<Operand>) => CalcChain;
  subtract: (...operands: Array<Operand>) => CalcChain;
  multiply: (...operands: Array<Operand>) => CalcChain;
  divide: (...operands: Array<Operand>) => CalcChain;
  negate: () => CalcChain;
  toString: () => string;
};

interface Calc {
  (x: Operand): CalcChain;
  add: typeof add;
  subtract: typeof subtract;
  multiply: typeof multiply;
  divide: typeof divide;
  negate: typeof negate;
}

/**
 * A function that creates a CSS calc expression.
 *
 * @example
 * calc('100px')
 *   .add('2rem')
 *   .multiply(2)
 *   .divide(3)
 *   .toString()  // 'calc((100px + 2rem) * 2 / 3)'
 *
 * // Or use static methods
 * calc.add('100px', '2rem')  // 'calc(100px + 2rem)'
 */
export const calc: Calc = Object.assign(
  (x: Operand): CalcChain => {
    return {
      add: (...operands) => calc(add(x, ...operands)),
      subtract: (...operands) => calc(subtract(x, ...operands)),
      multiply: (...operands) => calc(multiply(x, ...operands)),
      divide: (...operands) => calc(divide(x, ...operands)),
      negate: () => calc(negate(x)),
      toString: () => x.toString(),
    };
  },
  {
    add,
    subtract,
    multiply,
    divide,
    negate,
  }
);
