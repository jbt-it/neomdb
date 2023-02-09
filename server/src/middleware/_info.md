The middleware folder contains files for middleware functions.
Middleware functions are necessary to check various things **before** an incoming request is processed.

- Middlewares like cors, csrf and refererValidation should always be used before any incoming request.
- Middlewares for authentication and authroization should be used to protect (user login necessary) and restrict (specific role necessary) access to server resources and therefore should only be used on routes which need these kind of protection and restriction.