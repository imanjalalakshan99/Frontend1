interface Props {
  onClick: () => void;
}

const SignInButton = ({ onClick }: Props) => {
  return (
    <li className="cursor-pointer" onClick={onClick}>
      <div className="rounded-full border-2 border-green-600 bg-white px-4 py-2 text-base font-semibold text-green-700 transition duration-300 hover:bg-green-600 hover:text-white hover:shadow-lg">
        Sign In
      </div>
    </li>
  );
};

export default SignInButton;
