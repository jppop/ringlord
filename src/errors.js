export class AppError extends Error {
  constructor(message, component) {
    super(message);
    this.component = component;
  }
}
export class NotFoundError extends AppError {
  constructor(message, component) {
    super(message, component);
    this.name = "NotFound";
  }
}
