import axios from 'axios';

const API_URL = 'https://reqres.in/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Login API
export const loginUser = (email: string, password: string) =>
  api.post('/login', { email, password });

// Fetch Users API
export const getUsers = (page: number) =>
  api.get(`/users?page=${page}`);

// Update User API
export const updateUser = (id: number, data: { first_name: string; last_name: string; email: string }) =>
  api.put(`/users/${id}`, data);

// Delete User API
export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`);

export default api;
