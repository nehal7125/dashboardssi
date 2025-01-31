import axios from "axios";

const getToken = () => {
  if (window) {
    if (localStorage.getItem("authToken") !== null) {
      return JSON.parse(localStorage.getItem("authToken") || "");
    } else {
      return null;
    }
  }
};

// export const baseURL:string = "https://sei-backend-node-api.onrender.com";
export const baseURL:string = "http://34.204.92.198:4000";

export const useHttp = () => {
  return axios.create({
    baseURL,
    headers: {
      authorization: `Bearer ${getToken()}`,
    },
  });
};
