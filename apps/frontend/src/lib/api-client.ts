import axios from 'axios';

// Create a basic axios instance.
// The authentication token will be added to headers in the store actions themselves,
// after being fetched from a React component context.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default apiClient;
