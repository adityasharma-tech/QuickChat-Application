// api.js
import axios, { AxiosHeaders } from 'axios';
import { envs } from './constants';
import { retrieveUserSession } from './userSessions';

const apiClient = axios.create({
  baseURL: `${envs.server_url}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      await axios.get(envs.server_url!);
    } catch (error: any) {
      console.error('Domain initialization failed:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export const apiRequest = async (
  url: string,
  data: any = null,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'PATCH',
  options: {
    secure?: boolean,
    headers?: any
  } = {
    secure: false,
    headers: {}
  }
) => {
  const { secure, headers } = options;
  try {
    let token = null;
    if (secure) {
      const userdata = await retrieveUserSession();
      token = userdata.token;
    }

    const response = await apiClient({
      url: url,
      method: method.toUpperCase(),
      data: data,
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': headers['Content-Type'] ?? 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Request error: ', {
        message: error.message,
        response: error.response ? error.response.data : null,
        config: error.config,
      });
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const fetchConversationsInChunks = async (conversations: { conversationId: string, phoneNumber: string }[]) => {
  const chunkSize = 30;
  const chunks = [];
  for (let i = 0; i < conversations.length; i += chunkSize) {
    chunks.push(conversations.slice(i, i + chunkSize));
  }

  const results = [];
  for (const chunk of chunks) {
    try {
      const response = await apiRequest('/conversation/batch', { conversations: chunk }, 'POST', { secure: true, headers: {} });
      if (response.success) {
        results.push(...response.data);
      } else {
        throw new Error('Failed to fetch conversation data');
      }
    } catch (error) {
      console.error('Error fetching conversation data:', error);
    }
  }
  return results;
};
