import { MortgageCalculator } from "./components/MortgageCalculator/MortgageCalculator";

export default function Home() {
  return (
    <div className="mx-auto flex h-screen min-h-fit min-w-fit flex-col items-center justify-center p-3">
      <MortgageCalculator />
    </div>
  );
}
