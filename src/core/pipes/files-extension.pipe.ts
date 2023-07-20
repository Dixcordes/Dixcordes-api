import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { UploadTypesEnum } from '../enums/upload-types.enum';

@Injectable()
export class FileExtensionValidationPipe implements PipeTransform {
  transform(value: any): string {
    const fileExtension = extname(value.originalname).slice(1);

    if (
      !Object.values(UploadTypesEnum).includes(fileExtension as UploadTypesEnum)
    ) {
      throw new BadRequestException('Extension de fichier non autorisée');
    }

    return value;
  }
}
