import path from 'path';
import fs from 'fs';

export const removeFile = (pathFile: string) => {
  const pathLocal = '../../' + pathFile;

  try {
    fs.unlinkSync(path.join(__dirname, pathLocal));
  } catch (error: any) {
    console.error(error);
  }
};
