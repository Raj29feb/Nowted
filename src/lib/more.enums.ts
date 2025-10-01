export const MoreEnum = {
  Favorites: "Favorites",
  Trash: "Trash",
  Archived: "Archived Notes",
};

export type MoreEnum = (typeof MoreEnum)[keyof typeof MoreEnum];

export const MoreValue: MoreEnum[] = [
  MoreEnum.Favorites,
  MoreEnum.Archived,
  MoreEnum.Trash,
];
