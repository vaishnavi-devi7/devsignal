import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const githubApi = {
  auth: () => api.get('/github/auth'),
  getStatus: () => api.get('/github/status'),
  getOverview: () => api.get('/github/overview'),
  getRepositories: (page = 1, limit = 10) => api.get(`/github/repositories?page=${page}&limit=${limit}`),
  sync: () => api.post('/github/sync'),
  disconnect: () => api.delete('/github/disconnect'),
};

export default api;

export const dsaApi = {
  getProblems: (params) => api.get('/dsa/problems', { params }),
  createProblem: (data) => api.post('/dsa/problems', data),
  updateProblem: (id, data) => api.put(`/dsa/problems/${id}`, data),
  deleteProblem: (id) => api.delete(`/dsa/problems/${id}`),
  getStats: () => api.get('/dsa/stats'),
  getTopics: () => api.get('/dsa/topics'),
};

export const resumeApi = {
  getResume: () => api.get('/resume'),
  uploadResume: (data) => api.post('/resume/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateResume: (data) => api.put('/resume', data),
  deleteResume: () => api.delete('/resume')
};

export const jobsApi = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  getJobMatch: (id) => api.get(`/jobs/${id}/match`),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id) => api.delete(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/jobs/saved')
};

export const aiApi = {
  getProfileAnalysis: () => api.get('/ai/profile-analysis'),
  getRoadmap: () => api.get('/ai/roadmap'),
  getJobInsight: (id) => api.get(`/ai/jobs/${id}/insight`),
  getInterviewPrep: () => api.get('/ai/interview-prep')
};
