import {DinoServer} from 'dinossr';
import {middleware} from './server/mod.ts';

const dinossr = new DinoServer(new URL('./', import.meta.url).pathname);

await dinossr.init();

middleware(dinossr);
