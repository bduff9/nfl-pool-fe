import { render, screen } from "@testing-library/react";
import React from "react";

import Layout from "../../components/Layout/Layout";

describe("Layout", () => {
  it("renders children passed to it", () => {
    render(
      <Layout>
        <h1>Title</h1>
      </Layout>,
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Title");
  });
});
