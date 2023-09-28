import fs from 'fs/promises';
import { existsSync, statSync } from 'fs';

export async function getFiles(dirPath: string): Promise<string[]> {
  if (!existsSync(dirPath)) {
    throw new Error('Directory does not exist');
  }
  const filesNames = await fs.readdir(dirPath);
  return filesNames;
}

export async function checkFileExists(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    resolve(existsSync(filePath));
  });
}

export async function isDir(path: string): Promise<boolean> {
  return new Promise(resolve => {
    resolve(statSync(path).isDirectory());
  });
}

export async function createDir(path: string) {
  if (!(await checkFileExists(path))) {
    await fs.mkdir(path, { recursive: false }).catch(() => {
      throw new Error(
        `Couldn't create directory ${path}.\n No recursive directories will be created`,
      );
    });
  }
}
