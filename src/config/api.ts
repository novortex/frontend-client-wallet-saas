import axios from "axios";
const url = "https://backend-wallet-saas-developer.up.railway.app";

export const instance = axios.create({
    baseURL: url,
    withCredentials: true,
});
