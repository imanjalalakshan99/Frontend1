interface Props {
  onClick: () => void;
}

const SignInButton = ({ onClick }: Props) => {
  return (
    <li className="cursor-pointer" onClick={onClick}>
      <div className="rounded-md border bg-white px-2 py-1 text-sm font-bold text-blue-700">
        Sign In
      </div>
    </li>
  );
};

export default SignInButton;
