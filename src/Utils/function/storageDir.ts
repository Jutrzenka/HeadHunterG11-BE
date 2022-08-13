import { join } from 'path';

export const storageDir = (catalogName: string) => {
  const mainFolder = join(__dirname, '../storage');
  return join(mainFolder, catalogName);
};
