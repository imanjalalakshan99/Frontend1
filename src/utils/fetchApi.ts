import { getToken } from "./auth";
const MODE = import.meta.env.MODE;

const hostname = window.location.hostname;
const origin = window.location.origin;

export const apiURL =
  !MODE || MODE === "development" ? `http://${hostname}:5000` : origin;

const fetchApi = (path: string, options: RequestInit) => {
  if (!options.headers) {
    options.headers = {} as HeadersInit;
  }
  if (typeof options.body === "string") {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }
  const token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authentication: `Bearer ${token}`,
    };
  }
  const url = `${apiURL}${path}`;
  return fetch(url, options);
};

export default fetchApi;

export type ServerResponse = {
  message: string;
};
