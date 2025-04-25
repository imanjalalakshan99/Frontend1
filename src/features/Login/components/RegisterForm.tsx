import { useEffect, useState } from "react";
import Form from "./Card";
import Input from "components/Input";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { register } from "store/auth-actions";

interface Props {
  onLogIn: () => void;
  onSuccess: () => void;
}

const RegisterForm = ({ onLogIn, onSuccess }: Props) => {
  const loading = useAppSelector((state) => state.auth.loading);
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);
  const message = useAppSelector((state) => state.auth.message);
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validName = name.length > 0;
  const validEmail = email.includes("@");
  const validPassword = password.length >= 6;
  const validConfirmPassword = confirmPassword === password;

  const formValid =
    validEmail &&
    validPassword &&
    validConfirmPassword &&
    validName &&
    !loading;

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid) return;
    dispatch(register(email, password, name, "123456789", "1990-01-01"));
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        onSuccess();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

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
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={setName}
        isValid={validName}
        title="Name"
        name="name"
        errorMessage="Please enter your name."
      />
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
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        isValid={validConfirmPassword}
        title="Confirm Password"
        name="confirm-password"
        errorMessage="Passwords must match."
      />
      <Button
        text={"Sign up"}
        disabled={!formValid || !!message}
        loading={loading || !!message}
      />
      <p className="text-sm font-light text-gray-500">
        Already have an account?{" "}
        <a
          className="text-primary-600  cursor-pointer font-medium hover:underline"
          onClick={onLogIn}
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
