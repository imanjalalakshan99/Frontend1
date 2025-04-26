import { redirect } from "react-router";

export const getRedirectLoader = (url: string) => () => redirect(url);
