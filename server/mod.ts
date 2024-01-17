import * as auth from './middleware/auth.ts';
import * as api from './middleware/api.ts';
import type {DinoServer} from 'dinossr';

export const middleware = (dinossr: DinoServer) => {
  dinossr.router.use(auth.handle);
  dinossr.router.use(api.handle);
};
