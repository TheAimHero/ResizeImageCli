import sharp, { Sharp } from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, statSync } from 'fs';

let resizeImageDir: undefined | string = undefined;

interface processArgs {
  imagePath: string;
  width: number;
  height: number;
  format: 'png' | 'jpg';
}

function getResizeImageDir(
  imagePath: string,
  output: string,
  isFileBool: boolean,
) {
  let temp = '';
  if (isFileBool) {
    temp = imagePath.split('/').slice(0, -1).join('/');
  } else {
    temp = imagePath;
  }
  resizeImageDir =
    output === './Resized/'
      ? path.resolve(temp, 'Resized')
      : path.resolve(process.cwd(), output, 'Resized');
}

async function writeImage(
  sharpImgInstance: Sharp,
  imagePath: string,
  format: 'png' | 'jpg',
) {
  const extName = path.extname(imagePath);
  const dir = path.dirname(imagePath);
  const opName = path.basename(imagePath).split('.')[0];
  if (extName !== format) {
    sharpImgInstance.toFile(path.join(dir, opName + '.' + format));
    return;
  }

  sharpImgInstance.toFile(path.join(imagePath));
}

async function getImages(wallpaperDir: string) {
  const filesNames = await fs.readdir(wallpaperDir);

  const imageNames = filesNames.filter(file => {
    const isImage = file.endsWith('.jpg') || file.endsWith('.png');
    return isImage;
  });

  const imagePaths = imageNames.map(file => {
    return path.join(wallpaperDir, file);
  });

  return imagePaths;
}

async function checkImageMetadata(imagePath: string) {
  const { width, height, format } = await sharp(imagePath).metadata();
  return { width, height, format };
}

function changeImgFormat(img: string | Sharp, format: 'png' | 'jpg'): Sharp {
  if (typeof img === 'string') {
    return sharp(img).toFormat(format);
  }
  return img.toFormat(format);
}

function resizeImage(imagePath: string, height: number, width: number): Sharp {
  return sharp(imagePath).resize(width, height, { fit: 'cover' });
}

function getImageSavePath(imagePath: string): string | undefined {
  if (!resizeImageDir) return;
  return path.resolve(resizeImageDir, path.basename(imagePath));
}

async function processImage(
  imagePath: string,
  width: number,
  height: number,
  format: 'png' | 'jpg',
) {
  const {
    width: imgWidth,
    height: imgHeight,
    format: imgFormat,
  } = await checkImageMetadata(imagePath);

  if (imgWidth === width && imgHeight === height && imgFormat === format) {
    return;
  }

  const outputImagePath = getImageSavePath(imagePath);
  if (!outputImagePath) return;

  if (imgHeight !== height && imgWidth !== width && imgFormat === format) {
    const sharpImgInstance = resizeImage(imagePath, height, width);
    await writeImage(sharpImgInstance, outputImagePath, format);
  }

  if (imgHeight === height && imgWidth === width && imgFormat !== format) {
    const sharpImgInstance = changeImgFormat(imagePath, format);
    await writeImage(sharpImgInstance, outputImagePath, format);
  }

  if (imgHeight !== height && imgWidth !== width && imgFormat !== format) {
    let sharpImgInstance = sharp(imagePath).resize(width, height, {
      fit: 'cover',
    });
    sharpImgInstance = changeImgFormat(sharpImgInstance, format);
    await writeImage(sharpImgInstance, outputImagePath, format);
  }
}

async function isFile(processArgs: processArgs) {
  const { imagePath, width, height, format } = processArgs;
  const outputImagePath = getImageSavePath(imagePath);
  if (!outputImagePath) return;
  await processImage(imagePath, width, height, format);
}

async function isDir(processArgs: processArgs) {
  const { imagePath, width, height, format } = processArgs;
  const images = await getImages(imagePath);

  images.forEach(async imagePath => {
    await processImage(imagePath, width, height, format);
  });
}

export default async function resize(
  input: string,
  output: string,
  height: number,
  width: number,
  format: 'png' | 'jpg',
) {
  const imagePath = path.resolve(process.cwd(), input);
  if (!existsSync(imagePath)) {
    console.log('Image or Image Path does not exist...');
    return;
    // @todo: do proper error handling later
  }
  const isFileBool = statSync(imagePath).isFile();

  // @todo: do this only if the images are being modified
  // @hack: right now it will create the dir even if no images are modified
  getResizeImageDir(imagePath, output, isFileBool);

  // make the dir if it does not exist
  if (!resizeImageDir) return;

  if (!existsSync(resizeImageDir)) {
    await fs.mkdir(resizeImageDir, { recursive: true });
  }
  if (isFileBool) {
    isFile({ imagePath, width, height, format });
    return;
  }

  isDir({ imagePath, width, height, format });
}
