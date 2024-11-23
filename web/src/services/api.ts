import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    Authorization: "Bearer " + localStorage.getItem('auth')
  }
});

export default api;