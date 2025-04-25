interface Props {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ text, onClick, className, disabled }: Props) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };
  return (
    <button
      onClick={onClickHandler}
      className={`cursor-pointer rounded px-2 py-1 text-sm font-semibold disabled:cursor-not-allowed ${
        className ? className : ""
      }`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
