import React from "react";

export const Label = ({
  text,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  text: string;
}) => {
  return (
    <label className={`text-sm text-gray-700 ${className}`} {...props}>
      {text}
    </label>
  );
};
