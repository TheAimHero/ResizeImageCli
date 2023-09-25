import { Command } from 'commander';

import resize from '../actions/resize-image';

interface optionsInterface {
  output: string;
  width: string;
  height: string;
  format: 'png' | 'jpg';
}

export const resizeCommand = new Command()
  .command('resize')
  .argument('[inputDir|inputImg]', 'Input directory or Image')
  .option('-o, --output <outputDir >', 'Output directory', './Resized/')
  .option('-w, --width <width>', 'Width', '1920')
  .option('-h, --height <height>', 'Height', '1080')
  .option('-f, --format <png | jpg>', 'Format', 'png')
  .description('Resize an image')
  .action(async (input: string, options: optionsInterface) => {
    const { width, height, output, format = 'png' } = options;
    await resize(input, output, parseInt(height), parseInt(width), format);
  });
