interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TypeSelector = ({ value, onChange }: Props) => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };
  return (
    <>
      <label
        htmlFor="type"
        className="mb-1 block text-sm font-medium text-gray-900"
      >
        Type
      </label>
      <select
        onChange={onChangeHandler}
        value={value}
        className="mb-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
        id="type"
      >
        <option value="hotel">Hotel</option>
        <option value="restaurant">Restaurant</option>
        <option value="bar">Bar</option>
        <option value="barber">Barber</option>
      </select>
    </>
  );
};

export default TypeSelector;
