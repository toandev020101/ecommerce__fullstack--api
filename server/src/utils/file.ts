import path from 'path';
import fs from 'fs';

export const saveFile = (base64: string, name: string) => {
  const dataFile = base64.split(';')[0];
  const suffix = dataFile.split('/')[1];
  const pathFile = `/images/${Date.now()}_${name}.${suffix}`;
  const pathLocal = `../../../client/public/${pathFile}`;

  const buffer = Buffer.from(base64.split(',')[1], 'base64');
  try {
    fs.writeFileSync(path.join(__dirname, pathLocal), buffer);
  } catch (error: any) {
    console.error(error);
  }

  return pathFile;
};

export const removeFile = (pathFile: string) => {
  const pathLocal = '../../' + pathFile;

  try {
    fs.unlinkSync(path.join(__dirname, pathLocal));
  } catch (error: any) {
    console.error(error);
  }
};
