import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export class ImageOptimizer {
  private static readonly logger = new Logger('ImageOptimizer');

  /**
   * Optimizes an image: converts to WebP, resizes if needed, and compresses.
   * @param filePath Path to the original file
   * @returns Path to the optimized file
   */
  static async optimize(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    const directory = path.dirname(filePath);
    const filename = path.basename(filePath, ext);
    const optimizedName = `${filename}.webp`;
    const outputPath = path.join(directory, optimizedName);

    try {
      this.logger.log(`Optimizing image: ${filename}${ext} -> ${optimizedName}`);
      
      // 🚀 HARDENING: Disable sharp's memory cache to prevent OOM on VPS
      sharp.cache(false);
      
      await sharp(filePath)
        .rotate() // Auto-rotate based on EXIF data
        .webp({ quality: 80, effort: 4 }) // Effort 4 is faster than 6 for lower CPU load
        .toFile(outputPath);

      // If the original file wasn't webp, remove it to save space
      if (ext !== '.webp') {
        fs.unlinkSync(filePath);
      }

      this.logger.log(`Optimization complete: ${outputPath}`);
      return outputPath;
    } catch (error) {
      this.logger.error(`Failed to optimize image ${filePath}: ${error.message}`);
      return filePath; // Return original path if optimization fails
    }
  }
}
