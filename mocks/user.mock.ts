import { factory, primaryKey } from '@mswjs/data';
import { randomUUID } from 'crypto';
import type { DefaultRequestBody, MockedRequest, RestHandler } from 'msw';
import { rest } from 'msw';
import invariant from 'tiny-invariant';
import { API_BASE_URL } from '~/constants.server';

const db = factory({
  user: {
    id: primaryKey(String),
    email: String,
    password: String,
  },
  notes: {
    id: primaryKey(String),
    title: String,
    body: String,
  },
});

createUser('rachel@remix.run', 'racheliscool');

// Minimal mocks required to fulfill smoke test
export const userHandlers: Array<
  RestHandler<MockedRequest<DefaultRequestBody>>
> = [
  rest.get(`${API_BASE_URL}/users`, (req, res, ctx) => {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (email) {
      const user = db.user.findFirst({
        where: {
          email: { equals: email },
        },
      });
      return res(ctx.status(200), ctx.json(user));
    }

    return res(ctx.status(404));
  }),

  rest.get(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params;

    invariant(typeof id === 'string');

    if (id) {
      const user = db.user.findFirst({
        where: {
          id: { equals: id },
        },
      });
      return res(ctx.status(200), ctx.json(user));
    }

    return res(ctx.status(404));
  }),

  rest.post(`${API_BASE_URL}/users`, (req, res, ctx) => {
    const { email, password } = JSON.parse(req.body as string) as {
      email: string;
      password: string;
    };

    return res(ctx.status(201), ctx.json(createUser(email, password)));
  }),

  rest.get(`${API_BASE_URL}/users/:id/notes`, (req, res, ctx) => {
    const notes = db.notes.getAll();
    return res(ctx.status(200), ctx.json(notes));
  }),

  rest.get(`${API_BASE_URL}/users/:id/notes/:noteId`, (req, res, ctx) => {
    const { noteId } = req.params;

    invariant(typeof noteId === 'string');

    if (noteId) {
      const note = db.notes.findFirst({
        where: {
          id: { equals: noteId },
        },
      });
      return res(ctx.status(200), ctx.json(note));
    }

    return res(ctx.status(404));
  }),

  rest.post(`${API_BASE_URL}/users/:id/notes`, (req, res, ctx) => {
    const { title, body } = JSON.parse(req.body as string) as {
      title: string;
      body: string;
    };

    const note = db.notes.create({
      id: randomUUID(),
      title,
      body,
    });

    return res(ctx.status(201), ctx.json(note));
  }),

  rest.delete(`${API_BASE_URL}/users`, (req, res, ctx) => {
    const { email } = JSON.parse(req.body as string) as {
      email: string;
    };

    invariant(typeof email === 'string');

    db.user.delete({
      where: {
        email: { equals: email },
      },
    });

    return res(ctx.status(204));
  }),

  rest.delete(`${API_BASE_URL}/users/:id/notes/:noteId`, (req, res, ctx) => {
    const { noteId } = req.params;

    invariant(typeof noteId === 'string');

    const note = db.notes.delete({
      where: {
        id: { equals: noteId },
      },
    });

    return res(ctx.status(201), ctx.json(note));
  }),
];

function createUser(email: string, password: string) {
  return db.user.create({
    id: randomUUID(),
    email,
    password,
  });
}
