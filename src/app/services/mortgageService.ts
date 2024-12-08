type MortgagePaymentRequestParameters = {
  propertyPrice: string;
  annualInterestRate: string;
  downPayment: string;
  amortizationPeriod: string;
  paymentSchedule: string;
};

type MortgagePaymentResponse = {
  mortgagePayment?: number;
};

export const fetchMortgagePayment = async (
  params: MortgagePaymentRequestParameters,
  fetchOptions?: RequestInit,
): Promise<MortgagePaymentResponse> => {
  const searchParams = new URLSearchParams({
    propertyPrice: params.propertyPrice.toString(),
    annualInterestRate: params.annualInterestRate.toString(),
    downPayment: params.downPayment.toString(),
    amortizationPeriod: params.amortizationPeriod,
    paymentSchedule: params.paymentSchedule,
  });

  return fetch(
    `/api/mortgage-payment?${searchParams.toString()}`,
    fetchOptions,
  ).then((res) => res.json());
};

type CmhcInsuranceRateRequestParameters = {
  propertyPrice: string;
  downPayment: string;
};

type CmhcInsuranceRateResponse = {
  insuranceRate?: number;
  error?: string;
  errorCode?: string;
};

export const fetchCmhcInsuranceRate = async (
  params: CmhcInsuranceRateRequestParameters,
  fetchOptions?: RequestInit,
): Promise<CmhcInsuranceRateResponse> => {
  const searchParams = new URLSearchParams({
    propertyPrice: params.propertyPrice.toString(),
    downPayment: params.downPayment.toString(),
  });

  return fetch(
    `/api/cmhc-insurance-rate?${searchParams.toString()}`,
    fetchOptions,
  ).then((res) => res.json());
};
