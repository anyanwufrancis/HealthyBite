// src/api.js
const API_BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// Meals
export const getMeals = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/meals?${query}`);
  return res.json();
};

export const getMealById = async (id) => {
  const res = await fetch(`${API_BASE}/meals/${id}`);
  return res.json();
};

// Auth
export const signup = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const login = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

// Cart
export const addToCart = async (mealId, quantity = 1) => {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ mealId, quantity })
  });
  return res.json();
};

export const getCart = async () => {
  const res = await fetch(`${API_BASE}/cart`, { headers: headers() });
  return res.json();
};

// Admin
export const createMeal = async (mealData) => {
  const res = await fetch(`${API_BASE}/meals`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(mealData)
  });
  return res.json();
};

export const updateMeal = async (id, mealData) => {
  const res = await fetch(`${API_BASE}/meals/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(mealData)
  });
  return res.json();
};

export const deleteMeal = async (id) => {
  const res = await fetch(`${API_BASE}/meals/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  return res.json();
};