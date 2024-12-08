import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { MortgageCalculator } from "@/app/components/MortgageCalculator/MortgageCalculator";
import { server } from "@/app/mockServiceWorkerSetup";
import { http, HttpResponse } from "msw";

describe("MortgageCalculator", () => {
  test("renders the component", () => {
    render(<MortgageCalculator />);
    expect(screen.getByText(/Mortgage calculator/i)).toBeInTheDocument();
  });

  test("displays CMHC insurance rate and total mortgage when valid property price and down payment are entered", async () => {
    server.use(
      http.get("/api/cmhc-insurance-rate", () => {
        return HttpResponse.json({ insuranceRate: 7600 });
      }),
    );

    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Property Price/i), "200000");
    await userEvent.type(screen.getByLabelText(/Down Payment/i), "10000");

    expect(screen.getByText("+ CMHC insurance")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("$7,600.00")).toBeVisible();
    });

    expect(screen.getByText("= Total mortgage")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("$197,600.00")).toBeVisible();
    });
  });

  test("displays mortgage payment after entering valid values on all inputs", async () => {
    server.use(
      http.get("/api/mortgage-payment", () => {
        return HttpResponse.json({ mortgagePayment: 3728.96 });
      }),
    );

    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Property Price/i), "200000");
    await userEvent.type(screen.getByLabelText(/Down Payment/i), "10000");
    await userEvent.type(screen.getByLabelText(/Annual Interest Rate/i), "5");
    await userEvent.selectOptions(
      screen.getByLabelText(/Amortization Period/i),
      "5",
    );
    await userEvent.selectOptions(
      screen.getByLabelText(/Payment Schedule/i),
      "monthly",
    );

    expect(screen.getByText("Mortgage payment")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText("$3,728.96")).toBeVisible();
    });
  });

  test("shows error when down payment is greater than property price", async () => {
    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Property Price/i), "200000");
    await userEvent.type(screen.getByLabelText(/Down Payment/i), "300000");

    expect(
      await screen.findByText("Enter a down payment that is less than 100%"),
    ).toBeVisible();
  });

  test("handles API error gracefully", async () => {
    server.use(
      http.get("/api/cmhc-insurance-rate", () => {
        return HttpResponse.error();
      }),
    );

    render(<MortgageCalculator />);

    await userEvent.type(screen.getByLabelText(/Property Price/i), "200000");
    await userEvent.type(screen.getByLabelText(/Down Payment/i), "10000");

    await waitFor(() => {
      expect(
        screen.getByText(
          "Unable to calculate CMHC insurance rate, please try again",
        ),
      ).toBeVisible();
    });
  });
});
