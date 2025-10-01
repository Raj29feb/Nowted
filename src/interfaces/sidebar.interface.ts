export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Note {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview: string;
  folder: Folder;
}

export interface Folder{
  id:string,
  name:string,
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}