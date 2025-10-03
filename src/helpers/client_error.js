export default class ClientError extends Error {
  constructor(message, status, sendToSlack = false) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.status = status;
  }
}
