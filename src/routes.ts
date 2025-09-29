import app from '~/utils/plugins/app';
import { albumRoutes } from './albums';
import { songRoutes } from './songs';

export const routes = app.get('/', () => 'Hello Kamu').use(albumRoutes).use(songRoutes);
