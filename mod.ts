import {DinoServer} from 'dinossr';
import {middleware} from './server/mod.ts';
import {backup} from './server/data/backup.ts';

const dinossr = new DinoServer(new URL('./', import.meta.url).pathname);

await dinossr.init();

middleware(dinossr);

Deno.cron('backup', '30 16 * * *', backup);
