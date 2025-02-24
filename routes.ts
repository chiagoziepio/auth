/**
 * this are public routes. They dont need authentication
 * @type {string[]}
 **/

export const publicRoutes = ["/"];

/**
 * These routes are used for authentication. They are not protected routes
 * @type {string[]}
 **/

export const authRoutes = ["/auth/login", "/auth/register", "/auth/verify"];

/**
 * These routes are used for authentication. They are not protected routes
 * @type {string}
 **/
export const apiAuthRoutePrefix = "/api/auth";

/**
 * This is the default redirect route after login, the entry point after login
 * @type {string}
 **/

export const DEFAULT_REDIRECT_ROUTE = "/dashboard";
