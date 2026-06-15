export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class ObjectNotFound extends BusinessError {
  constructor(objectName: string) {
    super(`${objectName} Not Found`);
  }
}
export class BadRequest extends BusinessError {
  constructor(message: string) {
    super(message);
  }
}
export class Unauthorized extends BusinessError {
  constructor() {
    super("You are not allowed to commit this action");
  }
}
export class Unauthenticated extends BusinessError {
  constructor() {
    super("Login require");
  }
}
export class Confilct extends BusinessError {
  constructor(message: string) {
    super(message);
  }
}
export function handleBusinessError(error: BusinessError): string {
  return error.message;
}
