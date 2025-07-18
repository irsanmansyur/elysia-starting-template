import Elysia from 'elysia';
import { EventEmitterPlugin } from './event';
import { logPlugin } from './log';
import { errorPlugin } from '~/utils/plugins/errors/plugin';
import { DatabasePluging } from '../../src/database';
import { corsPluging } from '~/utils/plugins/cors';

const app = new Elysia().use(EventEmitterPlugin).use(logPlugin).use(errorPlugin).use(DatabasePluging).use(corsPluging);
export default app;
