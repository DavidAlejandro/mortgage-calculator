import { FlexRow } from "../../FlexRow";
import { Input } from "../../Input";
import { Label } from "../../Label";
import { Select } from "../../Select";
import { replaceNonDigitCharacters } from "../../../helpers";

export const MortgagePaymentsCalculation = ({
  annualInterestRate,
  amortizationPeriod,
  paymentSchedule,
  onAnnualInterestRateChange,
  onAmortizationPeriodChange,
  onPaymentScheduleChange,
}: {
  annualInterestRate: string;
  amortizationPeriod: string;
  paymentSchedule: string;
  onAnnualInterestRateChange: (annualInterestRate: string) => void;
  onAmortizationPeriodChange: (amortizationPeriod: string) => void;
  onPaymentScheduleChange: (paymentSchedule: string) => void;
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
          text="Annual interest rate (%)"
          htmlFor="annualInterestRate"
        />
        <Input
          className="flex-1"
          type="number"
          inputMode="numeric"
          name="annualInterestRate"
          aria-label="Annual Interest Rate"
          min={0}
          value={annualInterestRate}
          onChange={(event) =>
            onAnnualInterestRateChange(
              replaceNonDigitCharacters(event.target.value),
            )
          }
          onKeyDown={handleInputKeyDown}
        />
      </FlexRow>

      <FlexRow className="px-6">
        <Label
          className="flex-1"
          text="Amortization period"
          htmlFor="amortizationPeriod"
        />
        <Select
          name="amortizationPeriod"
          aria-label="Amortization Period"
          className="flex-1"
          value={amortizationPeriod}
          onChange={(e) => onAmortizationPeriodChange(e.target.value)}
          options={[
            { value: "5", label: "5 years" },
            { value: "10", label: "10 years" },
            { value: "15", label: "15 years" },
            { value: "20", label: "20 years" },
            { value: "25", label: "25 years" },
            { value: "30", label: "30 years" },
          ]}
        />
      </FlexRow>

      <FlexRow className="px-6">
        <Label
          className="flex-1"
          text="Payment schedule"
          htmlFor="paymentSchedule"
        />
        <Select
          name="paymentSchedule"
          aria-label="Payment Schedule"
          className="flex-1"
          value={paymentSchedule}
          onChange={(e) => onPaymentScheduleChange(e.target.value)}
          options={[
            {
              value: "acceleratedBiweekly",
              label: "Accelerated Bi-weekly",
            },
            { value: "biweekly", label: "Bi-weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </FlexRow>
    </>
  );
};
