import { render, screen } from "@testing-library/react";
import React from "react";

import Unauthenticated from "../../components/Unauthenticated/Unauthenticated";

describe("Unauthenticated", (): void => {
  beforeEach((): void => {
    render(
      <Unauthenticated>
        <div />
      </Unauthenticated>,
    );
  });

  it("exists", (): void => {
    expect(screen.getAllByTestId("unauthenticated")).toHaveLength(1);
  });
});
