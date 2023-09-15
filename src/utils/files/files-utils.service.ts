import * as dotenv from 'dotenv';
import { extname, join } from 'path';

dotenv.config();

export const uploadFilesPath = {
  user: process.env.USER_UPLOAD_LOCATION,
  server: process.env.SERVER_UPLOAD_LOCATION,
};

export class FilesServices {
  static generateUniqueFileName(originalFileName: string): string {
    const fileExt = extname(originalFileName);
    const uniqueFileName = `${Date.now()}${Math.random().toString(
      16,
    )}${fileExt}`;
    return uniqueFileName;
  }

  static uploadFilesPath(type: string) {
    if (type === 'user') {
      return join(__dirname, '../../../', uploadFilesPath.user);
    } else if (type === 'server') {
      return join(__dirname, '../../', uploadFilesPath.server);
    }
  }
}
