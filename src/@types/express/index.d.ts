
export {}

declare global {
  namespace Express {
    export interface Request {
        clienteId: string;
    }
  }
}