import { GET } from "../../api/cmhc-insurance-rate/route";
import { NextRequest } from "next/server";

describe("GET /api/cmhc-insurance-rate", () => {
  test("returns 200 status code and correct insurance rate for valid property price and down payment", async () => {
    const req = new NextRequest(
      "http://localhost/api/cmhc-insurance-rate?propertyPrice=200000&downPayment=10000",
    );
    const response = await GET(req);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      insuranceRate: 7600,
    });
  });

  test("returns 400 status code and error message when required query params are missing", async () => {
    const req = new NextRequest("http://localhost/api/cmhc-insurance-rate");
    const response = await GET(req);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error:
        "Missing required query parameters, expected: propertyPrice, downPayment",
    });
  });

  test("returns 400 status code and error message when down payment is less than minimum required", async () => {
    const req = new NextRequest(
      "http://localhost/api/cmhc-insurance-rate?propertyPrice=200000&downPayment=5000",
    );
    const response = await GET(req);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error:
        "A minimum down payment of $10,000.00 (5.0%) is required for this property price",
      errorCode: "insufficient_down_payment",
    });
  });
});
