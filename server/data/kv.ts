import {uuidv7} from 'uuidv7';
import * as format from './format.ts';
import type {BookmarkValue, Bookmark} from '../types.ts';

// Number of bookmarks per page
export const BOOKMARK_LIMIT = 10;

if (!Deno.env.has('DENO_KV_URL')) {
  throw new Error('Missing "DENO_KV_URL" environment variable');
}

export const db = await Deno.openKv(Deno.env.get('DENO_KV_URL'));

/** Generate new ID */
export const getId = () => uuidv7() as string;

/**
 * Get bookmark by ID
 * @returns Bookmark or `undefined`
 */
export const getBookmark = async (id: string) => {
  const item = await db.get<BookmarkValue>(['bookmarks', id]);
  if (!item.value) return;
  const bookmark: Bookmark = {
    id,
    hash: format.hash(id),
    html: await format.markdown(item.value.markdown),
    ...item.value
  };
  return bookmark;
};

/**
 * Update existing bookmark or create new bookmark
 * @returns Bookmark ID
 */
export const setBookmark = async (bookmark: BookmarkValue, id?: string) => {
  id = id ?? getId();
  await db.set(['bookmarks', id], bookmark);
  return id;
};

/** Delete bookmark by ID */
export const deleteBookmark = async (id: string) => {
  await db.delete(['bookmarks', id]);
};

/** Get list of bookmarks */
export const listBookmarks = (cursor?: string) => {
  return db.list<BookmarkValue>(
    {prefix: ['bookmarks']},
    {cursor, limit: BOOKMARK_LIMIT, reverse: true}
  );
};

// TODO: better way to do pagination?
// No count: https://github.com/denoland/deno/issues/18965
export const getFormattedPageCursors = async () => {
  let cursor: string | undefined;
  const pages: Array<string | undefined> = [undefined];
  do {
    const list = listBookmarks(cursor);
    let next = await list.next();
    if (next.done) {
      // Last page is empty so remove it
      pages.pop();
      break;
    }
    while (!next.done) next = await list.next();
    cursor = list.cursor;
    if (cursor) pages.push(cursor);
  } while (cursor);
  return pages;
};

export const getFormattedBookmarks = async (cursor?: string) => {
  const list = listBookmarks(cursor);
  const bookmarks = [];
  for await (const item of list) {
    const id = String(item.key[1]);
    const bookmark: Bookmark = {
      ...item.value,
      id,
      hash: format.hash(id),
      html: await format.markdown(item.value.markdown)
    };
    bookmarks.push(bookmark);
  }
  return bookmarks;
};

export const getFormattedPage = async (
  index = 0
): Promise<{
  index: number;
  length: number;
  bookmarks: Bookmark[];
}> => {
  if (index < 0) {
    throw new Error('Index less than zero');
  }
  const pages = await getFormattedPageCursors();
  if (index >= pages.length) {
    throw new Error('Index out of bounds');
  }
  return {
    index,
    length: pages.length,
    bookmarks: await getFormattedBookmarks(pages[index])
  };
};
