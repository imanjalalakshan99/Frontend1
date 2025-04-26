import { NavBar } from "features/Header";
import { LoginForm } from "features/Login";
import { useAppSelector } from "hooks/redux-hooks";
import { useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLogged);

  const onSuccessHandler = () => {
    navigate("/");
  };

  const onSignUpHandler = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <>
      <NavBar />
      <div className="m-auto px-4 xs:h-fit xs:w-fit xs:min-w-[320px] xs:px-0">
        <h1 className="pb-4 pt-6 text-2xl font-bold leading-tight tracking-tight text-gray-800 xs:pt-10 xs:pb-8">
          Sign in to your account
        </h1>
        <LoginForm onSignUp={onSignUpHandler} onSuccess={onSuccessHandler} />
      </div>
    </>
  );
};

export default Login;
