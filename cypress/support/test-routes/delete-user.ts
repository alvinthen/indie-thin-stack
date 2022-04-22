import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { deleteUserByEmail } from '~/models/user.server';

export const action: ActionFunction = async ({ request }) => {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨 test routes should not be enabled in production 🚨 🚨 🚨 🚨 🚨 🚨 🚨 🚨',
    );
    // test routes should not be enabled in production or without
    // enable test routes... Just in case this somehow slips through
    // we'll redirect :)
    return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }

  const { email } = await request.json();

  if (!email.endsWith('@example.com')) {
    throw new Error('All test emails must end in @example.com');
  }

  await deleteUserByEmail(email);

  return true;
};
