import React from "react";
import { render } from "@testing-library/react";
import Dashboard from "../members/Dashboard";

test("renders learn react link", () => {
  const { getByText } = render(<Dashboard />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
