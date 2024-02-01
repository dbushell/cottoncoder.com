import {DinoSsr} from 'dinossr';
import {middleware} from './server/mod.ts';
import {backup} from './server/data/backup.ts';

const dinossr = new DinoSsr(new URL('./', import.meta.url).pathname);

await dinossr.init();

dinossr.router.onError = (error, request) => {
  console.log(request.url, error);
  return new Response(null, {status: 500});
};

middleware(dinossr);

Deno.cron('backup', '30 16 * * *', backup);
