import { Command } from 'commander';

import { supprotedImageFormat } from '../types/imageTypes';
import singleResize from '../actions/single-resize';

interface optionsInterface {
  output: string | undefined;
  width: string;
  height: string;
  format: supprotedImageFormat;
}

export const singleCommand = new Command()
  .command('single')
  .argument('inputImg', 'Input Image')
  .option('-o, --output <outputDir >', 'Output directory', '')
  .option('-w, --width <width>', 'Width', '1920')
  .option('-h, --height <height>', 'Height', '1080')
  .option('-f, --format <png | jpg>', 'Format', 'png')
  .description('Resize and change format of singel image')
  .action(async (input: string, options: optionsInterface) => {
    const { width, height, output, format } = options;
    const intHeight = parseInt(height),
      intWidth = parseInt(width);
    await singleResize({
      format,
      input,
      height: intHeight,
      width: intWidth,
      output,
    });
  });
