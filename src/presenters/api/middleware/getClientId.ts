import { Request, Response, NextFunction } from 'express';
import throwError from 'handlerError/handlerError';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    sub: string
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req?.headers?.authorization?.split(' ')[1] as string;
        const decodedToken = jwt.decode(token) as DecodedToken;

        if (!decodedToken?.sub) {
            throw new Error('User not found');
        }
        req.clienteId = decodedToken?.sub;
        next();
    } catch (error: any) {
        console.error(error);
        throwError(
            "NO_PERMISSION",
            `authentication error`
          );
    }
};
