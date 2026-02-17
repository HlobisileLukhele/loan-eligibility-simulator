import { render, screen } from "@testing-library/react";
import LoanForm from "./LoanForm";


describe("LoanForm", () => {
  it("renders loan application form", () => {
    render(<LoanForm />);
    expect(screen.getByText(/Loan Application Form/i)).toBeInTheDocument();
  });
});