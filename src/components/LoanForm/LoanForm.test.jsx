import { render, screen } from "@testing-library/react";
import LoanForm from "./LoanForm";

// Remove the vitest import - Jest provides describe, it, expect globally
// import { describe, it, expect } from "vitest"; ❌ DELETE THIS LINE

describe("LoanForm", () => {
  it("renders loan application form", () => {
    render(<LoanForm />);
    expect(screen.getByText(/Loan Application Form/i)).toBeInTheDocument();
  });
});