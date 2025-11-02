import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// UPDATE: Mengganti nama 'loginUser' menjadi 'login' agar sesuai LoginPage.jsx
export async function login(username, password) {
   try {
    // Endpoint ini (/users/login) sudah benar
 const response = await axios.post(`${apiUrl}/users/login`, {
  username,
 password,
 });
 return response.data;
 } catch (error) {
    // UPDATE: Perbaikan error handling untuk menampilkan pesan rate limiter
if (error.response?.data?.error) {
 throw new Error(error.response.data.error);
 }
    if (error.response?.data) {
      // Ini akan menangkap pesan "Terlalu banyak percobaan..."
      throw new Error(String(error.response.data));
    }
 throw new Error('Login failed. Please try again.');
 }
}

// UPDATE: Mengganti nama 'registerUser' menjadi 'register'
export async function register(name, username, email, password) {
 try {
    // UPDATE: Endpoint register di backend adalah '/users', BUKAN '/users/register'
const response = await axios.post(`${apiUrl}/users`, {
 name,
 username,
 email,
 password,
 });
 return response.data;
 } catch (error) {
    // UPDATE: Perbaikan error handling untuk menampilkan pesan rate limiter
if (error.response?.data?.error) {
 throw new Error(error.response.data.error);
 }
    if (error.response?.data) {
      // Ini akan menangkap pesan "Terlalu banyak percobaan..."
      throw new Error(String(error.response.data));
    }
 throw new Error('Registration failed. Please try again.');
 }
}