import axios from 'axios';

// Create a basic axios instance.
// The authentication token will be added to headers in the store actions themselves,
// after being fetched from a React component context.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const handleApiError = (error: any) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/forbidden';
      }
    } else if (status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  handleApiError
);

export default apiClient;
