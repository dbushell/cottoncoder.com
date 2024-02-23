import {DinoSsr} from 'dinossr';
import * as auth from './server/auth.ts';
import {backup} from './server/backup.ts';
import type {DinoManifest} from 'dinossr';

const dir = new URL('./', import.meta.url).pathname;

let manifest: DinoManifest | undefined;
if (Deno.env.has('DENO_REGION')) {
  manifest = await import('file:///src/.dinossr/manifest.js');
}

const dinossr = new DinoSsr(dir, {
  manifest
});

await dinossr.init();

dinossr.router.onError = (error, request) => {
  console.log(request.url, error);
  return new Response(null, {status: 500});
};

dinossr.router.use(auth.handle);

if (!Deno.env.has('DENO_REGION')) {
  Deno.cron('backup', '30 16 * * *', backup);
}
