import { useState } from "react";
import fetchApi from "utils/fetchApi";

const useApi = <T>(path: string, options?: RequestInit) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [code, setCode] = useState<number | false>(false);

  const fetch = async (data?: Object) => {
    setLoading(true);
    setError(false);
    setData(undefined);
    setCode(false);

    let requestOptions = (options ? { ...options } : {}) as RequestInit;
    if (data) requestOptions.body = JSON.stringify(data);

    let response;
    try {
      response = await fetchApi(path, requestOptions);
    } catch (e) {
      setError("Something went wrong!");
      setLoading(false);
      return;
    }
    setCode(response.status);
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      try {
        const json = await response.json();
        if (response.ok) {
          setData(json);
        } else {
          setError(json.message ? json.message : "Something went wrong!");
        }
      } catch (e) {
        setError("Something went wrong!");
      }
    }
    setLoading(false);
    return response;
  };

  

  return { data, code, loading, error, fetch };
};

export default useApi;
