export type GalleryImage = {
  file: File;
  url: string;
};

// Adicione o tipo FileInfo
export type FileInfo = {
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  file: File;
  version: string;
};
