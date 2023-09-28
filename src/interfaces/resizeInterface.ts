import { supprotedImageFormat } from '../types/imageTypes';

export interface resizeInterface {
  input: string;
  output: string | undefined;
  width: number;
  height: number;
  format: supprotedImageFormat;
}

export interface processImageInterface {
  filePath: string;
  width: number;
  height: number;
  format: supprotedImageFormat;
  opImagePath: string;
}
