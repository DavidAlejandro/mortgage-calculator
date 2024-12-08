import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("/api/cmhc-insurance-rate", () => {
    return HttpResponse.json(
      {
        insuranceRate: 7600,
      },
      {
        status: 200,
      },
    );
  }),
  http.get("/api/mortgage-payment", () => {
    return HttpResponse.json(
      {
        mortgagePayment: 3728.9557680565713,
      },
      {
        status: 200,
      },
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export { server };
