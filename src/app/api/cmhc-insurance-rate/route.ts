import { type NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@/app/constants";
import {
  calculateCmhcInsuranceRate,
  getMinimumDownPayment,
  getQueryParams,
} from "../helpers";
import { formatNumberWithCommas } from "@/app/helpers";

const getCmhcInsuranceRate = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const requiredQueryParams = ["propertyPrice", "downPayment"];

  const { propertyPrice: propertyPriceStr, downPayment: downPaymentStr } =
    getQueryParams(searchParams, ...requiredQueryParams);

  if (!propertyPriceStr || !downPaymentStr) {
    return NextResponse.json(
      {
        error: `${ERROR_MESSAGES.MISSING_QUERY_PARAMS}, expected: ${requiredQueryParams.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const propertyPrice = parseFloat(propertyPriceStr);
  const downPayment = parseFloat(downPaymentStr);
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;
  const minimumDownPayment = getMinimumDownPayment(propertyPrice);
  const minimumDownPaymentPercentage =
    (minimumDownPayment / propertyPrice) * 100;

  if (downPayment < minimumDownPayment) {
    return NextResponse.json(
      {
        error: `A minimum down payment of $${formatNumberWithCommas(minimumDownPayment.toFixed(2))} (${minimumDownPaymentPercentage.toFixed(1)}%) is required for this property price`,
        errorCode: "insufficient_down_payment",
      },
      { status: 400 },
    );
  }

  let insuranceRate: number;

  try {
    insuranceRate = calculateCmhcInsuranceRate(
      propertyPrice,
      downPaymentPercentage,
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }

  return NextResponse.json({ insuranceRate: insuranceRate }, { status: 200 });
};

export const GET = getCmhcInsuranceRate;
