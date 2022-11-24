import axios from "axios";

import { API_BASEURL } from "../config/constants";

const instance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    // if (originalConfig.url !== "/web/login" && err.response) {


    // }
    return Promise.reject(err);
  }
);
export default instance;