import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const certificationApi = {
  list: (params?: { category?: string; level?: string; search?: string }) =>
    api.get('/certifications/', { params }),

  get: (id: number) => api.get(`/certifications/${id}`),

  getGraph: (category?: string) =>
    api.get('/certifications/graph', { params: { category } }),

  getCategories: () => api.get('/certifications/categories'),
};

export const careerApi = {
  list: (params?: { type?: string; category?: string; search?: string }) =>
    api.get('/careers/', { params }),

  get: (id: number) => api.get(`/careers/${id}`),

  listJobs: () => api.get('/careers/jobs'),

  listStartups: () => api.get('/careers/startups'),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/json', { email, password }),

  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),

  me: () => api.get('/auth/me'),
};
