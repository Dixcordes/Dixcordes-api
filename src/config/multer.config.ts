import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express/multer';

export class CustomMulterOptions implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: '/files',
    };
  }
}
