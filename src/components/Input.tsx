import { useState, useEffect } from "react";

interface Props {
  type: string;
  placeholder: string;
  value: string;
  errorMessage: string;
  title: string;
  onChange: (value: string) => void;
  isValid: boolean;
  name: string;
}

const Input = ({
  type,
  title,
  placeholder,
  value,
  errorMessage,
  onChange,
  isValid,
  name,
}: Props) => {
  const [isTouched, setIsTouched] = useState(false);
  const [error, setError] = useState(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setError(false);
  };

  const onBlurHandler = () => {
    setIsTouched(true);
  };

  useEffect(() => {
    if (isTouched) {
      const timeout = setTimeout(() => {
        if (!isValid) {
          setError(true);
        }
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isTouched, isValid, value]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {title}
      </label>
      <div className="relative my-2">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          name={name}
          className={` ${
            error ? "border-red-300" : "border-gray-300"
          } box-border block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm`}
        />
        {error && (
          <span className="absolute bottom-[1px] left-3 z-10 translate-y-1/2 bg-white px-1 text-xs text-red-500">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
