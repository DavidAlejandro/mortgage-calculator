import React from "react";
import { FormError } from "./FormError";
import { FlexRow } from "../../FlexRow";
import { Input } from "../../Input";
import { Label } from "../../Label";
import {
  replaceNonDigitCharacters,
  formatNumberWithCommas,
} from "../../../helpers";

export const TotalMortgageCalculation = ({
  propertyPrice,
  downPayment,
  downPaymentInsuranceError,
  cmhcInsurance,
  totalMortgage,
  onPropertyPriceChange,
  onDownPaymentChange,
}: {
  propertyPrice: string;
  downPayment: string;
  downPaymentInsuranceError: string;
  cmhcInsurance: number;
  totalMortgage: number;
  onPropertyPriceChange: (propertyPrice: string) => void;
  onDownPaymentChange: (downPayment: string) => void;
}) => {
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Minus" || event.code === "Equal") {
      event.preventDefault();
    }
  };
  return (
    <>
      <FlexRow className="px-6">
        <Label
          className="flex-1"
          text="Property price ($)"
          htmlFor="propertyPrice"
        />
        {/* Update input value to a currency format. */}
        <Input
          className="flex-1"
          aria-label="Property Price"
          type="number"
          inputMode="numeric"
          name="propertyPrice"
          min={0}
          value={propertyPrice}
          onChange={(event) =>
            onPropertyPriceChange(replaceNonDigitCharacters(event.target.value))
          }
          onKeyDown={handleInputKeyDown}
        />
      </FlexRow>

      <FlexRow className="px-6">
        <Label
          className="flex-1"
          text="- Down payment ($)"
          htmlFor="downPayment"
        />
        {/* Update input value to a currency format. */}
        <Input
          className="flex-1"
          aria-label="Down Payment"
          type="number"
          inputMode="numeric"
          name="downPayment"
          min={0}
          value={downPayment}
          onChange={(event) =>
            onDownPaymentChange(replaceNonDigitCharacters(event.target.value))
          }
          onKeyDown={handleInputKeyDown}
        />
      </FlexRow>

      <FlexRow className="px-6">
        <Label className="flex-1 text-sm" text="+ CMHC insurance" />
        {!downPaymentInsuranceError ? (
          <span className="flex-1">
            ${formatNumberWithCommas(cmhcInsurance.toFixed(2))}
          </span>
        ) : (
          <FormError className="flex-1" message={downPaymentInsuranceError} />
        )}
      </FlexRow>

      <FlexRow className="bg-primary-light/[0.5] p-6">
        <span className="flex-1 text-primary"> = Total mortgage</span>
        <span className="flex-1 font-bold text-primary">
          ${formatNumberWithCommas(totalMortgage.toFixed(2))}
        </span>
      </FlexRow>
    </>
  );
};
