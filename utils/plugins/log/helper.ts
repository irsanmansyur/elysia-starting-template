import { eventEmitter } from '../event';

export const LOG = {
	createExternal(create: APP.LOG.Create) {
		eventEmitter.emit('logger.create-external', create);
	},
	createLokal(message: string) {
		console.info(message);
	},
};
