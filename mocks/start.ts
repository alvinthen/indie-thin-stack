import { setupServer } from 'msw/node';
import '~/utils';
import { userHandlers } from './user.mock';

const server = setupServer(...userHandlers);

server.listen({ onUnhandledRequest: 'bypass' });
console.info('🔶 Mock server running');

process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
