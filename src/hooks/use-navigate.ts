import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";

export const useAppNavigate = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  return (path: string, options?: NavigateOptions) => {
    navigate(path + search, options);
  };
};
