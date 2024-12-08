import { ReactNode } from "react";

export const FlexRow = (props: { children: ReactNode; className?: string }) => {
  return (
    <div className={`flex flex-row items-center ${props.className || ""}`}>
      {props.children}
    </div>
  );
};
