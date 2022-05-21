const path = require("path");

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      if (process.env.NODE_ENV === "production") return;

      console.log("⚠️  Test routes enabled.");
      route(
        "__tests/create-user",
        path.join(__dirname, "cypress/support/test-routes/create-user.ts")
      );
      route(
        "__tests/delete-user",
        path.join(__dirname, "cypress/support/test-routes/delete-user.ts")
      );
    });
  },
};
