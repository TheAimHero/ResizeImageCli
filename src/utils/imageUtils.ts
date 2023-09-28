import sharp from 'sharp';
import { processImageInterface } from '../interfaces/resizeInterface';
import path from 'path';

export async function getMetaData(imagePath: string): Promise<sharp.Metadata> {
  return await sharp(imagePath).metadata();
}

export async function processImage(args: processImageInterface) {
  const { width, format, height, filePath, opImagePath } = args;
  await sharp(filePath).resize(width, height).toFormat(format).toFile(opImagePath);
}

export function filterImages(images: string[]) {
  return images.filter(image => {
    const imgName = path.basename(image);
    return imgName.endsWith('.jpg') || imgName.endsWith('.png');
  });
}
