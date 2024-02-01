import * as path from 'path';
import {Queue} from 'carriageway';
import {db} from './kv.ts';
import {hash} from './secret.ts';
import type {BookmarkValue} from './types.ts';

type BookmarkExport = BookmarkValue & {id: string};

const log = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Return backup directory path if defined and exists
export const backupDir = async (): Promise<string | undefined> => {
  if (!Deno.env.has('CC_BACKUP_PATH')) {
    return undefined;
  }
  const dir = Deno.env.get('CC_BACKUP_PATH')!;
  const stat = await Deno.stat(dir);
  if (!stat.isDirectory) {
    return undefined;
  }
  return dir;
};

export const backupBookmarks = async () => {
  const dir = await backupDir();
  if (!dir) return;
  const start = performance.now();
  // Create tasks queue collections
  const hashes = new Set<string>();
  const tasks: Array<Promise<void>> = [];
  const queue = new Queue<string, void>({
    concurrency: 10
  });
  // Iterate over bookmarks
  const list = db.list<BookmarkValue>({prefix: ['bookmarks']});
  for await (const item of list) {
    const id = String(item.key[1]);
    const idHash = hash(id);
    hashes.add(idHash);
    const bookmark: BookmarkExport = {
      ...item.value,
      id
    };
    const abspath = path.join(dir, `${idHash}.json`);
    tasks.push(
      queue
        .append(id, () => {
          Deno.writeTextFileSync(abspath, JSON.stringify(bookmark, null, 2));
        })
        .catch((error) => {
          log(`Error writing "${id}"`);
          console.error(error);
        })
    );
  }
  await Promise.all(tasks);
  // Remove old backups where bookmark hash no longer exists
  for await (const entry of Deno.readDir(dir)) {
    if (!entry.isFile || !entry.name.endsWith('.json')) {
      continue;
    }
    const entryHash = entry.name.split('.')[0];
    if (!hashes.has(entryHash)) {
      await Deno.remove(path.join(dir, entry.name));
    }
  }
  const end = performance.now();
  log(`Bookmarks backup ${(end - start).toFixed(2)}ms`);
};

export const backup = async () => {
  try {
    await backupBookmarks();
  } catch (error) {
    console.error(error);
  }
};
