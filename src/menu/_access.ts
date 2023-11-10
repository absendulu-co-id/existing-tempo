export const menuAccess = (
  id: string,
  access?: {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
  },
) => {
  const add = access == null ? true : access.add ?? false;
  const edit = access == null ? true : access.edit ?? false;
  const del = access == null ? true : access.delete ?? false;

  return [
    ...(add ? [{ id: `${id}_add`, title: "Tambah" }] : []),
    ...(edit ? [{ id: `${id}_edit`, title: "Ubah" }] : []),
    ...(del ? [{ id: `${id}_delete`, title: "Hapus" }] : []),
  ];
};
