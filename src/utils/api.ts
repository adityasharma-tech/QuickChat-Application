// api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      await axios.get(process.env.SERVER_URL!)
    } catch (error: any) {
      console.log('Domain initialization failed:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export const apiRequest = async (
  url: string,
  data: any = null,
  method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE' = 'PATCH'
) => {
  try {
    const response = await apiClient({
      url: url,
      method: method.toUpperCase(),
      data: data
    });
    console.log(url);
    return response.data;
  } catch (error) {
    if(axios.isAxiosError(error)){
      console.error('API Request error: ', {
        message: error.message,
        response: error.response ? error.response.data : null,
        config: error.config
      });
    } else {
      console.error('Unexpected error:',error)
    }
    return null;
  }
}
