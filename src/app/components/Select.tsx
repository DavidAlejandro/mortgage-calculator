import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const Select = (props: SelectProps) => {
  return (
    <select
      {...props}
      className={`input-primary ${props.className}`}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
