import { GET } from "../../api/mortgage-payment/route";
import { NextRequest } from "next/server";

describe("GET /api/mortgage-payment", () => {
  test("returns 200 status code and correct mortgage payment for valid query parameters", async () => {
    const req = new NextRequest(
      "http://localhost/api/mortgage-payment?propertyPrice=200000&downPayment=10000&annualInterestRate=5&amortizationPeriod=5&paymentSchedule=monthly",
    );
    const response = await GET(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ mortgagePayment: 3728.9557680565713 });
  });

  test("returns 400 status code and error message when required query params are missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/mortgage-payment?propertyPrice=100000&downPayment=20000&annualInterestRate=5&amortizationPeriod=25",
    );
    const response = await GET(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error:
        "Missing required query parameters, expected: propertyPrice, downPayment, annualInterestRate, amortizationPeriod, paymentSchedule",
    });
  });

  test("returns 400 status code and error message when the payment schedule query parameter is invalid", async () => {
    const req = new NextRequest(
      "http://localhost/api/mortgage-payment?propertyPrice=200000&downPayment=10000&annualInterestRate=5&amortizationPeriod=25&paymentSchedule=invalidSchedule",
    );
    const res = await GET(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error:
        "Invalid payment schedule, expected one of: monthly, biweekly, acceleratedBiweekly",
    });
  });

  test("returns 400 status code and error message when down payment is less than the minimum required", async () => {
    const req = new NextRequest(
      "http://localhost/api/mortgage-payment?propertyPrice=200000&downPayment=5000&annualInterestRate=5&amortizationPeriod=5&paymentSchedule=monthly",
    );
    const response = await GET(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Down payment is less than the minimum required",
    });
  });
});
