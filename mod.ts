import {DinoSsr} from 'dinossr';
import * as auth from './server/auth.ts';
import {backup} from './server/backup.ts';

const dinossr = new DinoSsr(new URL('./', import.meta.url).pathname);

await dinossr.init();

dinossr.router.onError = (error, request) => {
  console.log(request.url, error);
  return new Response(null, {status: 500});
};

dinossr.router.use(auth.handle);

Deno.cron('backup', '30 16 * * *', backup);
