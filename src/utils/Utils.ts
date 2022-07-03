import {Response} from 'express';

export const blockedUsernames = ["me", "404"]

export function sendError(res: Response, code: number, message: string) {
    res.status(code).send({
        status: code,
        error: message
    });
}