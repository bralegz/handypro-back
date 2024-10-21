import { Module } from '@nestjs/common';
import { UploadPhotoController } from './upload-photo.controller';
import { UploadPhotoService } from './upload-photo.service';

@Module({
  controllers: [UploadPhotoController],
  providers: [UploadPhotoService]
})
export class UploadPhotoModule {}
