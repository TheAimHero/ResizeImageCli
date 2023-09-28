import { Command } from 'commander';

import { supprotedImageFormat } from '../types/imageTypes';
import multiResize from '../actions/multi-resize';

interface optionsInterface {
  output: string | undefined;
  width: string;
  height: string;
  format: supprotedImageFormat;
}

export const multiCommand = new Command()
  .command('multi')
  .argument('inputDir', 'Input Directory')
  .option('-o, --output <outputDir >', 'Output directory', '')
  .option('-w, --width <width>', 'Width', '1920')
  .option('-h, --height <height>', 'Height', '1080')
  .option('-f, --format <png | jpg>', 'Format', 'png')
  .description('Resize and change format of multiple images in a directory')
  .action((input: string, options: optionsInterface) => {
    const { width, height, output, format } = options;
    const intHeight = parseInt(height),
      intWidth = parseInt(width);
    multiResize({
      format,
      input,
      height: intHeight,
      width: intWidth,
      output,
    });
  });
