import { MortgageCalculator } from "./components/MortgageCalculator/MortgageCalculator";

export default function Home() {
  return (
    <div className="mx-auto flex h-screen w-1/2 flex-col items-center justify-center">
      <MortgageCalculator />
    </div>
  );
}
