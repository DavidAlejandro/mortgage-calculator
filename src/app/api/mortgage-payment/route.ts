import { type NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/app/constants";
import {
  calculateCmhcInsuranceRate,
  calculateMortgagePayment,
  getMinimumDownPayment,
  getQueryParams,
} from "../helpers";

enum PaymentSchedules {
  monthly = "monthly",
  biweekly = "biweekly",
  acceleratedBiweekly = "acceleratedBiweekly",
}

const getMortgagePayment = async (req: NextRequest) => {
  // http://localhost:3000/api/mortgage?propertyPrice=100000&annualInterestRate=5000&downPayment=5&amortizationPeriod=5&paymentSchedule=monthly
  const searchParams = req.nextUrl.searchParams;
  const requiredQueryParams = [
    "propertyPrice",
    "downPayment",
    "annualInterestRate",
    "amortizationPeriod",
    "paymentSchedule",
  ];

  const {
    propertyPrice: propertyPriceStr,
    downPayment: downPaymentStr,
    annualInterestRate: annualInterestRateStr,
    amortizationPeriod: amortizationPeriodStr,
    paymentSchedule: paymentScheduleStr,
  } = getQueryParams(searchParams, ...requiredQueryParams);

  if (
    !propertyPriceStr ||
    !downPaymentStr ||
    !annualInterestRateStr ||
    !amortizationPeriodStr ||
    !paymentScheduleStr
  ) {
    return NextResponse.json(
      {
        error: `${ERROR_MESSAGES.MISSING_QUERY_PARAMS}, expected: ${requiredQueryParams.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const isPaymentSchedule = (
    schedule: string,
  ): schedule is PaymentSchedules => {
    return Object.values(PaymentSchedules).includes(
      schedule as PaymentSchedules,
    );
  };

  if (!isPaymentSchedule(paymentScheduleStr)) {
    return NextResponse.json(
      {
        error: `${ERROR_MESSAGES.INVALID_PAYMENT_SCHEDULE}, expected one of: ${Object.values(PaymentSchedules).join(", ")}`,
      },
      { status: 400 },
    );
  }

  const downPayment = parseFloat(downPaymentStr);
  const propertyPrice = parseFloat(propertyPriceStr);
  const minimumDownPayment = getMinimumDownPayment(propertyPrice);

  if (downPayment < minimumDownPayment) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.INSUFFICIENT_DOWN_PAYMENT },
      { status: 400 },
    );
  }

  const paymentSchedule = paymentScheduleStr as keyof typeof mortgagePayment;
  const annualInterestRate = parseFloat(annualInterestRateStr);
  const amortizationPeriod = parseInt(amortizationPeriodStr);
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  let cmhcInsurancePremium = 0;

  try {
    cmhcInsurancePremium = calculateCmhcInsuranceRate(
      propertyPrice,
      downPaymentPercentage,
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }

  const principal = propertyPrice - downPayment + cmhcInsurancePremium;

  const MONTHLY_PAYMENTS_PER_YEAR = 12;
  const BIWEEKLY_PAYMENTS_PER_YEAR = 26;

  const monthlyMortgagePayment = calculateMortgagePayment(
    principal,
    amortizationPeriod,
    annualInterestRate,
    MONTHLY_PAYMENTS_PER_YEAR,
  );

  /* Biweekly mortgage payment is calculated by dividing the annual mortgage payment into 26 equal payments.
  Accelerated biweekly mortgage payment is calculated by taking half of the monthly mortgage payment,
   which results in making an extra monthly payment each year, thus paying off the mortgage faster.*/
  const biweeklyMortgagePayment = calculateMortgagePayment(
    principal,
    amortizationPeriod,
    annualInterestRate,
    BIWEEKLY_PAYMENTS_PER_YEAR,
  );
  const acceleratedBiweeklyMortgagePayment = monthlyMortgagePayment / 2;

  const mortgagePayment = {
    monthly: monthlyMortgagePayment,
    biweekly: biweeklyMortgagePayment,
    acceleratedBiweekly: acceleratedBiweeklyMortgagePayment,
  };

  return NextResponse.json(
    { mortgagePayment: mortgagePayment[paymentSchedule] },
    { status: 200 },
  );
};

export const GET = getMortgagePayment;
