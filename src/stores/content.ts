import { atom, computed } from "nanostores";

export interface Content {
  path: string;
  newPath?: string;
  content: string;
  newContent?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  isCreated?: boolean;
}

export const $contents = atom<Content[]>([]);
export const $touched = computed($contents, (contents) =>
  contents.filter((d) => d.isEdited || d.isDeleted || d.isCreated || d.newPath)
);

export function initContents(contents: Record<string, string>) {
  $contents.set(
    Object.entries(contents).map(([path, content]) => ({
      path,
      content,
      isEdited: false,
      isDeleted: false,
      isCreated: false,
    }))
  );
}

export function addContent(path: string, content?: string) {
  $contents.set([
    ...$contents.get(),
    { path, content: "", newContent: content || `## ${path}`, isCreated: true },
  ]);
}

export function renameContent(path: string, newPath: string) {
  $contents.set(
    $contents
      .get() // get all contents
      .map((d) => (d.path === path ? { ...d, newPath } : d))
  );
}

export function updateContent(path: string, newContent: string) {
  $contents.set(
    $contents
      .get()
      .map((d) => (d.path === path ? { ...d, newContent, isEdited: true } : d))
  );
}

export function undoContent(path: string) {
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

export function deleteContent(path: string) {
  $contents.set(
    $contents
      .get()
      .map((d) => (d.path === path ? { ...d, isDeleted: true } : d))
  );
}

export function getContent(path: string) {
  return $contents.get().find((d) => d.path === path);
}
