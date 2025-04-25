import { useEffect, useState } from "react";
import Form from "./Card";
import Input from "components/Input";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { login } from "store/auth-actions";

interface Props {
  onSignUp: () => void;
  onSuccess: () => void;
}

const LoginForm = ({ onSignUp, onSuccess }: Props) => {
  const loading = useAppSelector((state) => state.auth.loading);
  const user = useAppSelector((state) => state.auth.user);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);
  const message = useAppSelector((state) => state.auth.message);
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = email.includes("@");
  const validPassword = password.length >= 6;

  const formValid = validEmail && validPassword && !loading;

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid) return;
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (user) {
      onSuccess();
    }
  }, [user]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex h-full w-full flex-col space-y-4 bg-white text-gray-600"
    >
      {errorMessage && (
        <h2 className="text-base font-bold leading-tight tracking-tight text-red-400">
          {errorMessage}
        </h2>
      )}
      {message && (
        <h2 className="text-base font-bold leading-tight tracking-tight text-green-400">
          {message}
        </h2>
      )}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={setEmail}
        isValid={validEmail}
        title="Email"
        name="email"
        errorMessage="Please enter a valid email address."
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={setPassword}
        isValid={validPassword}
        title="Password"
        name="password"
        errorMessage="Password must be at least 6 characters long."
      />
      <Button text={"Sign in"} disabled={!formValid} loading={loading} />
      <p className="text-sm font-light text-gray-500 ">
        Don’t have an account yet?{" "}
        <a
          className="cursor-pointer font-medium hover:underline"
          onClick={onSignUp}
        >
          Sign up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
