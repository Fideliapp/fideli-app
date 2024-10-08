import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: "Bearer " + localStorage.getItem('authToken')
  }
});

export default api;