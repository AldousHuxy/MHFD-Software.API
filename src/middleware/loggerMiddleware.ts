import { log } from 'console';
import { NextFunction, Request, Response } from 'express';
import colors from 'colors';

const METHOD_COLORS = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red',
    PATCH: 'cyan',
    DEFAULT: 'white'
} as const

type MethodColor = keyof typeof METHOD_COLORS

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const color = METHOD_COLORS[req.method as MethodColor] || METHOD_COLORS.DEFAULT;

    log(colors[color](`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} ${new Date().toISOString()}`))
    next()
}