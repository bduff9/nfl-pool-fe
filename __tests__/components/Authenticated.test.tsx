import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import React from "react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

import Authenticated from "../../components/Authenticated/Authenticated";

describe("Authenticated", (): void => {
  const mockRouterPush = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useRouter as any).mockImplementation(() => ({
    push: mockRouterPush,
  }));

  beforeEach((): void => {
    render(
      <Authenticated>
        <div />
      </Authenticated>,
    );
  });

  it("exists", (): void => {
    expect(screen.getAllByTestId("authenticated")).toHaveLength(1);
  });
});
