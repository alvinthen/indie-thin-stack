import { API_BASE_URL } from '~/constants.server';
import type { Note } from './note.server';

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
};

export async function getUserById(id: User['id']) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  return response.json();
}

export async function getUserByEmail(email: User['email']) {
  const response = await fetch(`${API_BASE_URL}/users?email=${email}`);

  if (response.ok) {
    return response.json();
  }
  return null;
}

export async function createUser(email: User['email'], password: string) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function deleteUserByEmail(email: User['email']) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'DELETE',
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function verifyLogin(email: User['email'], password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
