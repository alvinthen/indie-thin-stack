import faker from '@faker-js/faker';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a random user. Yields the user and adds an alias to the user
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'whatever@example.com' })
       */
      login: typeof login;

      /**
       * Deletes the current @user
       *
       * @returns {typeof cleanupUser}
       * @memberof Chainable
       * @example
       *    cy.cleanupUser()
       * @example
       *    cy.cleanupUser({ email: 'whatever@example.com' })
       */
      cleanupUser: typeof cleanupUser;
    }
  }
}

function login({
  email = faker.internet.email(undefined, undefined, 'example.com'),
}: {
  email?: string;
} = {}) {
  cy.then(() => ({ email })).as('user');
  cy.request('POST', '/__tests/create-user', { email });
  return cy.get('@user');
}

function cleanupUser({ email }: { email?: string } = {}) {
  if (email) {
    cy.request('POST', '/__tests/delete-user', { email });
  } else {
    cy.get('@user').then((user) => {
      const email = (user as { email?: string }).email;
      if (email) {
        cy.request('POST', '/__tests/delete-user', { email });
      }
    });
  }
  cy.clearCookie('__session');
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('cleanupUser', cleanupUser);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
