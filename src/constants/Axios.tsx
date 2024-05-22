import axios from 'axios';

// export const baseURL = 'https://j20200007.kotsf.com/asl';  // test server
// export const mediaBaseURL = 'https://j20200007.kotsf.com'; // test server
// export const baseURL = "http://gpuserver.edu.hku.hk/asl";  // old production server
export const mediaBaseURL = 'https://apsap.arts.hku.hk'; // test server
export const baseURL = 'http://apsap.arts.hku.hk/asl'; // current production server

// Test backend url to check for jwt authorization handling from one of my old projects
// axios.defaults.baseURL = "https://ser.talli.dev/";

axios.defaults.baseURL = 'http://apsap.arts.hku.hk/asl/';
//axios.defaults.baseURL = 'http://gpuserver.edu.hku.hk/asl/';
// axios.defaults.baseURL = 'https://j20200007.kotsf.com/asl/';

// Can add any interceptors here, like for jwt tokens
