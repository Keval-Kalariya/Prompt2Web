import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expandPrompt = async (prompt, model, apiKey) => {
  const response = await api.post('/api/expand-prompt', {
    prompt,
    model,
    api_key: apiKey,
  });
  return response.data;
};

export const generateHtml = async (designSpec, model, apiKey) => {
  const response = await api.post('/api/generate-html', {
    design_spec: designSpec,
    model,
    api_key: apiKey,
  });
  return response.data;
};

export const getUsage = async (apiKey) => {
  const response = await api.get(`/api/usage?api_key=${apiKey}`);
  return response.data;
};

export const resetUsage = async (apiKey, adminPassword) => {
  const response = await api.post(`/api/reset-usage?api_key=${apiKey}`, {}, {
    headers: {
      'admin-password': adminPassword,
    },
  });
  return response.data;
};

export default api;
