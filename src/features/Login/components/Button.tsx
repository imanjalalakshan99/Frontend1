import Spinner from "./Spinner";

interface Props {
  text: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({ text, disabled, loading }: Props) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${
        disabled
          ? "cursor-not-allowed bg-[#7197fe] hover:bg-[#7197fe] focus:ring-[#fd9393]"
          : "bg-[#2563eb] hover:bg-[#1d4ed8] focus:ring-[#93c5fd]"
      } w-full rounded px-5 py-2.5 text-center
       font-medium text-white hover:bg-[#1d4ed8] focus:outline-none focus:ring-4`}
    >
      {loading ? <Spinner /> : text}
    </button>
  );
};

export default Button;
