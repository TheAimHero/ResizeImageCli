import path from 'path';

import { resizeInterface } from '../interfaces/resizeInterface';
import { checkFileExists, createDir, isDir } from '../utils/fileUtils';
import { processImage } from '../utils/imageUtils';

async function singleResize(args: resizeInterface) {
  try {
    const { input, output, width, height, format } = args;

    const inputPath = path.resolve(input);

    // @todo: central error handling
    if (!(await checkFileExists(inputPath))) {
      throw new Error(`Input file does not exists: ${inputPath}`);
    }

    if (await isDir(inputPath)) {
      throw new Error(
        `Input file is a directory: ${inputPath}\nPlease give a file`,
      );
    }

    const outputPath = path.join(
      path.resolve(output ? output : path.dirname(input)),
      'Resized',
    );

    if (!(await checkFileExists(outputPath))) {
      // @todo: print the relative path
      console.log(`Output path does not exists: ${outputPath}`);
      console.log(`Creating directory: ${outputPath}`);
      await createDir(outputPath);
      console.log(`Directory created: ${outputPath}`);
    }

    const fileName = path.basename(input).split('.')[0];
    const opImagePath = path.join(outputPath, `${fileName}.${format}`);

    await processImage({
      filePath: inputPath,
      width,
      height,
      format,
      opImagePath,
    });
    console.log(`Image processed: ${opImagePath}`);
  } catch (err: unknown) {
    if (err instanceof Error) console.log(err.message);
    process.exit(1);
  }
}

export default singleResize;
