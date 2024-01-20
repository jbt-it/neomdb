import path from "path";
import fs from "fs/promises";

/**
 * Get the path of an image
 * @param basePath The base path to the image folder
 * @param imageName The name of the image
 * @returns The path of the image and its mime type
 */
export const getPathOfImage = async (basePath: string, imageName: string) => {
  const imageNames = await fs.readdir(basePath);
  let mimeType = null;
  imageNames.forEach((imageName) => {
    if (imageName.includes(imageName)) {
      mimeType = path.extname(imageName).split(".")[1];
    }
  });

  if (mimeType === null) {
    return null;
  }

  const imagePath = path.join(basePath, path.basename(`${imageName}.${mimeType}`));
  return { imagePath, mimeType };
};
