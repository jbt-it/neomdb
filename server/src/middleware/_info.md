The middleware folder contains files for middleware functions.
Middleware functions are necessary to check various things **before** an incoming request is processed.

- Middlewares like cors, csrf and refererValidation should always be used before any incoming request.
- Middlewares for authentication and authrorization should be used to protect (user login necessary) and restrict (specific role necessary) access to server resources and therefore should only be used on routes which need these kind of protection and restriction.
- The error handler middleware is used for outgoing responses. If an error is thrown in the express application, this error is catched in the error handler middleware and the correct http status code corresponding to the thrown error is sent.