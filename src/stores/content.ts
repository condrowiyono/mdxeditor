import { atom, computed } from "nanostores";

export interface Content {
  path: string;
  newPath?: string;
  content?: string;
  newContent?: string;
  isFetched?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  isCreated?: boolean;
}

export const $contents = atom<Content[]>([]);
export const $touched = computed($contents, (contents) =>
  contents.filter((d) => d.isEdited || d.isDeleted || d.isCreated || d.newPath)
);

/**
 * Check if content exists and is fetched
 *
 * @param path content path
 * @returns boolean
 */
export function contentExist(path: string) {
  return $contents.get().some((d) => d.path === path && d.isFetched);
}

/**
 * Generate new content with no content
 *
 * @param path content path
 * @returns boolean
 */
export function initContents(contents: { path: string }[]) {
  $contents.set(contents.map((d) => ({ path: d.path, isFetched: false })));
}

/**
 * Add new content with default content of `## ${path}`
 *
 * @param path content path
 * @param content content
 */
export function addContent(path: string, content?: string) {
  $contents.set([
    ...$contents.get(),
    { path, content: "", newContent: content || `## ${path}`, isCreated: true },
  ]);
}

/**
 * Fill content with new content from server
 *
 * @param path content path
 * @param content content
 */
export function fillContent(path: string, content: string) {
  $contents.set(
    $contents
      .get()
      .map((d) => (d.path === path ? { ...d, content, isFetched: true } : d))
  );
}

/**
 * Rename content path
 *
 * @param path content path
 * @param newPath new content path
 */
export function renameContent(path: string, newPath: string) {
  $contents.set(
    $contents.get().map((d) => (d.path === path ? { ...d, newPath } : d))
  );
}

/**
 * Update content with new content
 *
 * @param path content path
 * @param newContent new content
 */
export function updateContent(path: string, newContent: string) {
  $contents.set(
    $contents
      .get()
      .map((d) => (d.path === path ? { ...d, newContent, isEdited: true } : d))
  );
}

/**
 * Undo content changes
 *
 * @param path content path
 */
export function undoContent(path: string) {
  if ($contents.get().some((d) => d.path === path && d.isCreated)) {
    $contents.set($contents.get().filter((d) => d.path !== path));
    return;
  }

  $contents.set(
    $contents
      .get()
      .map((d) =>
        d.path === path
          ? { ...d, newContent: d.content, isEdited: false, isDeleted: false }
          : d
      )
  );
}

/**
 * Delete content by flagging it as deleted
 *
 * @param path content path
 */
export function deleteContent(path: string) {
  $contents.set(
    $contents
      .get()
      .map((d) => (d.path === path ? { ...d, isDeleted: true } : d))
  );
}

/**
 * Get content by path
 *
 * @param path content path
 * @returns content
 */
export function getContent(path: string) {
  return $contents.get().find((d) => d.path === path);
}
