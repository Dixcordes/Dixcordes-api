export class FilesServices {
  static generateUniqueFileName(originalFileName: string): string {
    // Implémentation de la logique pour générer un nom de fichier unique
    // Par exemple, vous pouvez utiliser un identifiant unique, une horodatage, etc.
    const uniqueFileName = `${Date.now()}_${originalFileName}`;
    return uniqueFileName;
  }
}

// export class FilesUpload (file: Express.Multer.File, oldFile: Express.Multer.File): Promise<string> {

// }
