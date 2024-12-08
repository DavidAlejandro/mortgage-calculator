"use client";

import React, { useEffect, useState } from "react";

import {
  fetchCmhcInsuranceRate,
  fetchMortgagePayment,
} from "../../services/mortgageService";
import { FlexRow } from "../FlexRow";
import { formatNumberWithCommas } from "../../helpers";
import { TotalMortgageCalculation } from "./components/TotalMortageCalculation";
import { MortgagePaymentsCalculation } from "./components/MortgagePaymentsCalculation";
import { ERROR_MESSAGES } from "@/app/constants";

/**
 * TODO:
 * - Debounce input changes to avoid excessive API calls.
 * - Update input values to a currency format.
 */

export const MortgageCalculator = () => {
  const [propertyPrice, setPropertyPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [amortizationPeriod, setAmortizationPeriod] = useState("5");
  const [paymentSchedule, setPaymentSchedule] = useState("monthly");
  const [cmhcInsurance, setCmhcInsurance] = useState(0);
  const [downPaymentError, setDownPaymentError] = useState("");
  const [mortgagePayment, setMortgagePayment] = useState(0);

  //TODO: Debounce input changes to avoid excessive API calls
  useEffect(() => {
    const abortController = new AbortController();

    const getCmhcInsuranceRate = async (
      propertyPrice: string,
      downPayment: string,
    ) => {
      if (!propertyPrice || !downPayment) {
        return;
      }

      if (parseFloat(downPayment) > parseFloat(propertyPrice)) {
        setDownPaymentError(ERROR_MESSAGES.EXCESSIVE_DOWN_PAYMENT);
        return;
      }

      try {
        const insuranceRateData = await fetchCmhcInsuranceRate(
          {
            propertyPrice,
            downPayment,
          },
          { signal: abortController.signal },
        );
        if (typeof insuranceRateData?.insuranceRate === "number") {
          setCmhcInsurance(insuranceRateData.insuranceRate);
          setDownPaymentError("");
        } else if (
          insuranceRateData?.errorCode === "insufficient_down_payment"
        ) {
          setCmhcInsurance(0);
          setMortgagePayment(0);
          setDownPaymentError(
            insuranceRateData?.error ||
              "Unable to calculate CMHC insurance rate, please try again",
          );
        }
      } catch (error) {
        console.error(error);
        setCmhcInsurance(0);
        setMortgagePayment(0);
        setDownPaymentError(
          "Unable to calculate CMHC insurance rate, please try again",
        );
      }
    };

    getCmhcInsuranceRate(propertyPrice, downPayment);

    return () => {
      abortController.abort("Cancel request on component unmount");
    };
  }, [propertyPrice, downPayment]);

  //TODO: Debounce input changes to avoid excessive API calls
  useEffect(() => {
    if (downPaymentError) {
      setMortgagePayment(0);
      return;
    }

    const abortController = new AbortController();

    const getMortgagePayment = async (
      propertyPrice: string,
      annualInterestRate: string,
      downPayment: string,
      amortizationPeriod: string,
      paymentSchedule: string,
    ) => {
      if (!propertyPrice || !annualInterestRate || !downPayment) {
        setMortgagePayment(0);
        return;
      }

      try {
        const mortgagePaymentData = await fetchMortgagePayment(
          {
            propertyPrice,
            annualInterestRate,
            downPayment,
            amortizationPeriod,
            paymentSchedule,
          },
          { signal: abortController.signal },
        );

        if (typeof mortgagePaymentData?.mortgagePayment === "number") {
          setMortgagePayment(mortgagePaymentData.mortgagePayment);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMortgagePayment(
      propertyPrice,
      annualInterestRate,
      downPayment,
      amortizationPeriod,
      paymentSchedule,
    );

    return () => {
      abortController.abort("Cancel request on component unmount");
    };
  }, [
    propertyPrice,
    downPayment,
    annualInterestRate,
    amortizationPeriod,
    paymentSchedule,
    downPaymentError,
  ]);

  let totalMortgage = 0;
  if (!!propertyPrice && !!downPayment && typeof cmhcInsurance === "number") {
    totalMortgage =
      parseFloat(propertyPrice) - parseFloat(downPayment) + cmhcInsurance;
  }

  return (
    <>
      <header className="w-[26rem] rounded-t-md border border-primary bg-primary px-6 py-4">
        <h1 className="text-center font-bold text-white">
          Mortgage calculator
        </h1>
      </header>
      <div className="w-[26rem] space-y-3 bg-white pt-6 shadow-lg">
        <form className="flex flex-col space-y-3">
          <TotalMortgageCalculation
            propertyPrice={propertyPrice}
            downPayment={downPayment}
            downPaymentInsuranceError={downPaymentError}
            cmhcInsurance={cmhcInsurance}
            totalMortgage={totalMortgage}
            onPropertyPriceChange={(propertyPrice) =>
              setPropertyPrice(propertyPrice)
            }
            onDownPaymentChange={(downPayment) => setDownPayment(downPayment)}
          />

          <MortgagePaymentsCalculation
            annualInterestRate={annualInterestRate}
            amortizationPeriod={amortizationPeriod}
            paymentSchedule={paymentSchedule}
            onAnnualInterestRateChange={(annualInterestRate) =>
              setAnnualInterestRate(annualInterestRate)
            }
            onAmortizationPeriodChange={(amortizationPeriod) =>
              setAmortizationPeriod(amortizationPeriod)
            }
            onPaymentScheduleChange={(paymentSchedule) =>
              setPaymentSchedule(paymentSchedule)
            }
          />
        </form>

        <FlexRow className="bg-primary-light/[0.5] p-6">
          <span className="flex-1 text-primary">Mortgage payment</span>
          <span className="flex-1 font-bold text-primary">
            ${formatNumberWithCommas(mortgagePayment.toFixed(2))}
          </span>
        </FlexRow>
      </div>
    </>
  );
};
