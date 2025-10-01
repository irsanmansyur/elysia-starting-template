import { Elysia } from 'elysia';
import { HttpException, ValidationException } from './exception';
import { ErrorHanlder, parseStackTrace } from './helper';
import { LOG } from '../log/helper';
import { isProduction } from '~/utils/configs';
const timeZone = 'Asia/Jakarta';

export const errorPlugin = new Elysia({
	name: 'error-plugin',
})
	.error({ HttpException, ValidationException })
	.onError({ as: 'global' }, ({ error, code, set, path, request }) => {
		const timestamp = new Date().toLocaleString('id-ID', { timeZone }).replace(', ', ' ').replaceAll('.', ':');
		const defaultLog = `${timestamp} :: ${request.method} :: ${path} :: ${(performance.now() / 100).toFixed(2)}ms`;
		switch (code) {
			case 'ValidationException':
				set.status = error.status;
				return { message: error.message, errors: error.errors };

			case 'HttpException':
				const status = error.status || 500;

				if (error.saveLog) {
					LOG.createExternal({
						level: status < 500 ? 'warn' : 'error',
						message: error.message,
						stack: parseStackTrace(error.stack),
					});
				}

				set.status = status;
				return error.data;

			case 'VALIDATION':
			case 'INVALID_COOKIE_SIGNATURE':
				return ErrorHanlder.validation(error.message, path, request.method);

			case 'NOT_FOUND':
				return ErrorHanlder.notFound(error.message);

			default:
				const messageError = (error as any)?.['message'] || 'Internal server error';
				console.error({ error });
				return {
					message: isProduction ? 'Internal server error' : messageError,
				};
		}
	});
