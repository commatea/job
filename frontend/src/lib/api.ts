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

// 관리자 API
export const adminApi = {
  // 자격증 관리
  certifications: {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get('/admin/certifications/', { params }),
    get: (id: number) => api.get(`/admin/certifications/${id}`),
    create: (data: CertificationFormData) => api.post('/admin/certifications/', data),
    update: (id: number, data: CertificationFormData) =>
      api.put(`/admin/certifications/${id}`, data),
    delete: (id: number) => api.delete(`/admin/certifications/${id}`),
  },
  // 직업 관리
  careers: {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get('/admin/careers/', { params }),
    get: (id: number) => api.get(`/admin/careers/${id}`),
    create: (data: CareerFormData) => api.post('/admin/careers/', data),
    update: (id: number, data: CareerFormData) =>
      api.put(`/admin/careers/${id}`, data),
    delete: (id: number) => api.delete(`/admin/careers/${id}`),
  },
  // 사용자 관리
  users: {
    list: (params?: { page?: number; limit?: number }) =>
      api.get('/admin/users/', { params }),
    get: (id: number) => api.get(`/admin/users/${id}`),
    update: (id: number, data: { is_active?: boolean; is_superuser?: boolean }) =>
      api.put(`/admin/users/${id}`, data),
  },
};

// 마이페이지 API
export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: { full_name?: string }) => api.put('/users/me', data),
  getMyCertifications: () => api.get('/users/me/certifications'),
  addCertification: (certificationId: number, data: { acquired_date?: string; score?: number }) =>
    api.post(`/users/me/certifications/${certificationId}`, data),
  removeCertification: (certificationId: number) =>
    api.delete(`/users/me/certifications/${certificationId}`),
  getMyGoals: () => api.get('/users/me/goals'),
};

// Form 타입
export interface CertificationFormData {
  name: string;
  code?: string;
  category_main?: string;
  category_sub?: string;
  level?: string;
  level_order?: number;
  issuer?: string;
  fee_written?: number;
  fee_practical?: number;
  pass_rate?: string;
  description?: string;
  eligibility?: string;
  subjects?: string;
  is_active?: boolean;
}

export interface CareerFormData {
  name: string;
  type: 'job' | 'startup';
  category?: string;
  description?: string;
  salary_range?: string;
  growth_potential?: string;
}
