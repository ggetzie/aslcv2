import axios from "axios";

export const baseURL = "https://j20200007.kotsf.com";
// Test backend url to check for jwt authorization handling from one of my old projects
// axios.defaults.baseURL = "https://ser.talli.dev/";
axios.defaults.baseURL = "https://j20200007.kotsf.com/";

// Can add any interceptors here, like for jwt tokens
