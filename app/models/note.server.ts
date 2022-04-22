import { API_BASE_URL } from '~/constants.server';
import type { User } from './user.server';

export type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  userId: String;
};

export async function getNote({
  id,
  userId,
}: Pick<Note, 'id'> & {
  userId: User['id'];
}) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/notes/${id}`);
  return response.json();
}

export async function getNoteListItems({
  userId,
}: {
  userId: User['id'];
}): Promise<Note[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/notes`);
  return (await response.json()) as Note[];
}

export async function createNote({
  body,
  title,
  userId,
}: Pick<Note, 'body' | 'title'> & {
  userId: User['id'];
}) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ body, title }),
  });
  return response.json();
}

export async function deleteNote({
  id,
  userId,
}: Pick<Note, 'id'> & { userId: User['id'] }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/notes/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
