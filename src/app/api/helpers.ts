import { ERROR_MESSAGES } from "@/app/constants";

export const getQueryParams = (
  searchParams: URLSearchParams,
  ...paramNames: string[]
): { [key: string]: string } => {
  const queryParams: { [key: string]: string } = {};
  paramNames.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      queryParams[param] = value;
    }
  });
  return queryParams;
};

export const getMinimumDownPayment = (propertyPrice: number) => {
  let minimumDownPayment: number;

  if (propertyPrice <= 500000) {
    minimumDownPayment = propertyPrice * 0.05;
  } else if (propertyPrice < 1000000) {
    minimumDownPayment = 500000 * 0.05 + (propertyPrice - 500000) * 0.1;
  } else {
    minimumDownPayment = propertyPrice * 0.2;
  }

  return minimumDownPayment;
};

export const calculateCmhcInsuranceRate = (
  propertyPrice: number,
  downPaymentPercent: number,
) => {
  type InsurancePremiumRateByDownPaymentPercentage = {
    minimumDownPaymentPercentage: number;
    premiumRate: number;
  };

  const INSURANCE_PREMIUM_RATES_BY_DOWN_PAYMENT_PERCENTAGE: InsurancePremiumRateByDownPaymentPercentage[] =
    [
      { minimumDownPaymentPercentage: 20, premiumRate: 0 },
      { minimumDownPaymentPercentage: 15, premiumRate: 0.028 },
      { minimumDownPaymentPercentage: 10, premiumRate: 0.031 },
      { minimumDownPaymentPercentage: 5, premiumRate: 0.04 },
    ];

  const applicableRate =
    INSURANCE_PREMIUM_RATES_BY_DOWN_PAYMENT_PERCENTAGE.find(
      (rate) => downPaymentPercent >= rate.minimumDownPaymentPercentage,
    )?.premiumRate;

  if (typeof applicableRate !== "number") {
    throw new Error(ERROR_MESSAGES.UNSUCCESSFUL_CMHC_RATE_CALCULATION);
  }

  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const insurancePremiumRate = (propertyPrice - downPayment) * applicableRate;

  return insurancePremiumRate;
};

export const calculateMortgagePayment = (
  principal: number,
  amortizationPeriod: number,
  annualInterestRatePercentage: number,
  paymentsPerYear: number,
) => {
  const interestRatePerPayment =
    annualInterestRatePercentage / 100 / paymentsPerYear;
  const totalPayments = amortizationPeriod * paymentsPerYear;

  const mortgagePayment =
    principal *
    ((interestRatePerPayment *
      Math.pow(1 + interestRatePerPayment, totalPayments)) /
      (Math.pow(1 + interestRatePerPayment, totalPayments) - 1));
  return mortgagePayment;
};
