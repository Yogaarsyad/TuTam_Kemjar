import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function login(username, password) {
   try {
 const response = await axios.post(`${apiUrl}/users/login`, {
  username,
 password,
 });
 return response.data;
 } catch (error) {

if (error.response?.data?.error) {
 throw new Error(error.response.data.error);
 }
    if (error.response?.data) {

      throw new Error(String(error.response.data));
    }
 throw new Error('Login failed. Please try again.');
 }
}

export async function register(name, username, email, password) {
 try {

const response = await axios.post(`${apiUrl}/users`, {
 name,
 username,
 email,
 password,
 });
 return response.data;
 } catch (error) {

if (error.response?.data?.error) {
 throw new Error(error.response.data.error);
 }
    if (error.response?.data) {

      throw new Error(String(error.response.data));
    }
 throw new Error('Registration failed. Please try again.');
 }
}