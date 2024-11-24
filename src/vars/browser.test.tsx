import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { assignCSSVar, createCSSVar } from "./index";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

function TestComponent({
  cssVar,
  testId = "test-element",
}: {
  cssVar: string;
  testId?: string;
}) {
  return (
    <div data-testid={testId} style={{ color: cssVar }}>
      Test Element
    </div>
  );
}

describe("CSS Variables Browser Tests", () => {
  it("should apply a basic CSS variable", () => {
    const colorVar = createCSSVar("color");
    const { name, value } = assignCSSVar(colorVar, "red");

    // Set the CSS variable at root level
    document.documentElement.style.setProperty(name, value);

    render(<TestComponent cssVar={colorVar} />);

    const element = screen.getByTestId("test-element");
    expect(element.style.color).toBe(colorVar);
  });

  it("should handle complex values like rgba", () => {
    const colorVar = createCSSVar("complex-color");
    const { name, value } = assignCSSVar(colorVar, "rgba(255, 0, 0, 0.5)");

    document.documentElement.style.setProperty(name, value);

    render(<TestComponent cssVar={colorVar} />);

    const element = screen.getByTestId("test-element");
    const styles = window.getComputedStyle(element);
    expect(styles.color).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("should handle calc expressions", () => {
    const widthVar = createCSSVar("width");
    const { name, value } = assignCSSVar(widthVar, "calc(100% - 20px)");

    document.documentElement.style.setProperty(name, value);

    render(
      <div style={{ width: "200px" }}>
        <div data-testid="calc-element" style={{ width: widthVar }}>
          Test Element
        </div>
      </div>
    );

    const element = screen.getByTestId("calc-element");
    expect(element.style.width).toBe("var(--width)");
  });
});
