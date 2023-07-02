export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnautherizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnautherizedError";
  }
}

export class UnauthenticatedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class QueryError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "QueryError";
  }
}
