import React from "react";
import cn from "classnames";

const NumberInput = ({ name, disabled, placeholder, value, onChange }) => {
  return (
    <input
      id={name}
      name={name}
      type="number"
      step="0.1"
      className={cn(
        "form-input block w-full sm:text-sm sm:leading-5 text-lg p-3 border-t border-b",
        {
          "bg-gray-200 text-gray-600": disabled,
        }
      )}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default NumberInput;
