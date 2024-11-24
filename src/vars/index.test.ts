import { describe, expect, it } from "vitest";

import {
  assignCSSVar,
  createCSSVar,
  fallbackCSSVar,
  getCSSVarName,
  isCSSVarName,
  isValidCSSVarName,
} from "./index";

describe("CSS Variable Name Validation", () => {
  describe("isValidCSSVarName", () => {
    it("should accept valid custom property names", () => {
      expect(isValidCSSVarName("my-var")).toBe(true);
      expect(isValidCSSVarName("foo")).toBe(true);
      expect(isValidCSSVarName("foo-bar")).toBe(true);
      expect(isValidCSSVarName("_foo")).toBe(true);
      expect(isValidCSSVarName("myCustomProperty")).toBe(true);
      expect(isValidCSSVarName("my_custom_property")).toBe(true);
      expect(isValidCSSVarName("property123")).toBe(true);
    });

    it("should reject invalid names", () => {
      expect(isValidCSSVarName("")).toBe(false);
      expect(isValidCSSVarName("1foo")).toBe(false);
      expect(isValidCSSVarName("@foo")).toBe(false);
      expect(isValidCSSVarName("foo/bar")).toBe(false);
      expect(isValidCSSVarName(".foo")).toBe(false);
      expect(isValidCSSVarName("#foo")).toBe(false);
    });

    it("should reject names with spaces", () => {
      expect(isValidCSSVarName("foo bar")).toBe(false);
      expect(isValidCSSVarName(" foo")).toBe(false);
      expect(isValidCSSVarName("foo ")).toBe(false);
    });

    it("should handle escaped unicode characters", () => {
      expect(isValidCSSVarName("foo\\2665")).toBe(true);
      expect(isValidCSSVarName("foo\\20")).toBe(true);
      expect(isValidCSSVarName("foo\\0020")).toBe(true);
      expect(isValidCSSVarName("\\2665foo")).toBe(true);
    });
  });

  describe("isCSSVarName", () => {
    it("should accept valid custom property names with -- prefix", () => {
      expect(isCSSVarName("--my-var")).toBe(true);
      expect(isCSSVarName("--foo")).toBe(true);
      expect(isCSSVarName("--myCustomProperty")).toBe(true);
      expect(isCSSVarName("--property123")).toBe(true);
      expect(isCSSVarName("--_foo")).toBe(true);
    });

    it("should reject invalid custom property names", () => {
      expect(isCSSVarName("my-var")).toBe(false);
      expect(isCSSVarName("-my-var")).toBe(false);
      expect(isCSSVarName("---my-var")).toBe(false);
      expect(isCSSVarName("--")).toBe(false);
      expect(isCSSVarName("--1foo")).toBe(false);
    });

    it("should reject custom property names with spaces", () => {
      expect(isCSSVarName("--foo bar")).toBe(false);
      expect(isCSSVarName("-- foo")).toBe(false);
      expect(isCSSVarName("--foo ")).toBe(false);
    });

    it("should handle escaped sequences correctly", () => {
      expect(isCSSVarName("--foo\\2665")).toBe(true);
      expect(isCSSVarName("--\\2665foo")).toBe(true);
      expect(isCSSVarName("--foo\\20")).toBe(true);
      expect(isCSSVarName("--foo\\0020")).toBe(true);
    });
  });
});

describe("createCSSVar", () => {
  it("should create a CSS variable", () => {
    const fooVar = createCSSVar("foo");
    expect(fooVar).toBe("var(--foo)");
  });

  it("should create a CSS variable with fallback", () => {
    const fooVar = createCSSVar("foo", { fallback: "red" });
    expect(fooVar).toBe("var(--foo, red)");
  });

  it("should handle escaped characters", () => {
    const unicodeVar = createCSSVar("foo\\2665");
    expect(unicodeVar).toBe("var(--foo\\2665)");
  });

  it("should throw on empty string", () => {
    expect(() => createCSSVar("")).toThrow();
  });

  it("should throw on invalid characters", () => {
    expect(() => createCSSVar("foo@bar")).toThrow();
  });
});

describe("fallbackCSSVar", () => {
  it("should create a fallback with a string", () => {
    const fooVar = createCSSVar("foo");
    const fallback = fallbackCSSVar(fooVar, "baz");
    expect(fallback).toBe("var(--foo, baz)");
  });

  it("should create a fallback with CSS variable", () => {
    const fooVar = createCSSVar("foo");
    const bazVar = createCSSVar("baz");
    const fallback = fallbackCSSVar(fooVar, bazVar);
    expect(fallback).toBe("var(--foo, var(--baz))");
  });

  it("should create fallback with multiple values", () => {
    const fooVar = createCSSVar("foo");
    const bazVar = createCSSVar("baz");
    const fallback = fallbackCSSVar(fooVar, bazVar, "12");
    expect(fallback).toBe("var(--foo, var(--baz, 12))");
  });

  it("should handle calc expressions", () => {
    const widthVar = createCSSVar("width");
    const fallback = fallbackCSSVar(widthVar, "calc(100% - 20px)");
    expect(fallback).toBe("var(--width, calc(100% - 20px))");
  });
});

describe("getCSSVarName", () => {
  it("should extract variable name", () => {
    const fooVar = createCSSVar("foo");
    const fooVarName = getCSSVarName(fooVar);
    expect(fooVarName).toBe("--foo");
  });

  it("should handle complex variable names", () => {
    const complexVar = createCSSVar("theme-color-primary-500");
    const varName = getCSSVarName(complexVar);
    expect(varName).toBe("--theme-color-primary-500");
  });
});

describe("assignCSSVar", () => {
  it("should assign string value", () => {
    const fooVar = createCSSVar("foo");
    expect(assignCSSVar(fooVar, "baz")).toEqual({
      name: "--foo",
      value: "baz",
    });
  });

  it("should assign number value", () => {
    const numberVar = createCSSVar("spacing");
    expect(assignCSSVar(numberVar, "12")).toEqual({
      name: "--spacing",
      value: "12",
    });
  });

  it("should handle CSS functions", () => {
    const colorVar = createCSSVar("overlay-color");
    expect(assignCSSVar(colorVar, "rgba(0, 0, 0, 0.5)")).toEqual({
      name: "--overlay-color",
      value: "rgba(0, 0, 0, 0.5)",
    });
  });

  it("should handle calc expressions", () => {
    const widthVar = createCSSVar("container-width");
    expect(assignCSSVar(widthVar, "calc(100% - 2rem)")).toEqual({
      name: "--container-width",
      value: "calc(100% - 2rem)",
    });
  });

  it("should throw on undefined value", () => {
    const testVar = createCSSVar("test");
    // @ts-expect-error - testing undefined value
    expect(() => assignCSSVar(testVar, undefined)).toThrow();
  });
});
