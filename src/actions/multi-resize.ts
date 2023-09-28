import path from 'path';
import { resizeInterface } from '../interfaces/resizeInterface';
import {
  checkFileExists,
  createDir,
  getFiles,
  isDir,
} from '../utils/fileUtils';
import { filterImages, getMetaData, processImage } from '../utils/imageUtils';

async function multiResize(args: resizeInterface) {
  const { input, output, height, width, format } = args;
  const inputPath = path.resolve(input);
  const outputPath = path.join(
    output ? path.resolve(output) : inputPath,
    'Resized',
  );

  if (!(await checkFileExists(input))) {
    throw new Error(`Input file does not exists: ${input}`);
  }

  if (!(await isDir(inputPath))) {
    throw new Error(`Input path is not a directory: ${inputPath}`);
  }

  if (!(await checkFileExists(outputPath))) {
    // @todo: print the relative path
    console.log(`Output path does not exists: ${outputPath}`);
    console.log(`Creating directory: ${outputPath}`);
    await createDir(outputPath);
    console.log(`Directory created: ${outputPath}`);
  }

  const files = await getFiles(input);
  const images = filterImages(files);

  console.log(`Processing ${images.length} images...`);
  let count = 0;

  const imagesPromises = images.map(async image => {
    const filePath = path.join(inputPath, image);

    const {
      width: imgWidth,
      height: imgHeight,
      format: imgFormat,
    } = await getMetaData(filePath);

    if (imgWidth === width && imgHeight === height && imgFormat === format) {
      return;
    }
    count++;
    const opImagePath = path.join(
      outputPath,
      `${image.split('.')[0]}.${format}`,
    );
    await processImage({
      filePath,
      width,
      height,
      format,
      opImagePath,
    });
  });

  await Promise.allSettled(imagesPromises);
  console.log(`Done. Processed ${count} images.`);
}

export default multiResize;
