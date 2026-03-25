import morgan from 'morgan';

// Minimal logger wrapper. For production replace with pino/winston.
export const info = (...args) => console.log('[INFO]', ...args);
export const error = (...args) => console.error('[ERROR]', ...args);

export const morganMiddleware = morgan('dev');
